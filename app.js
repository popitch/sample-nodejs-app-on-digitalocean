var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// init sniffer
(async (Exchangers) => {
    const fs = require('fs'),
           _ = require('lodash'),
       fetch = require('node-fetch'),
     convert = require('xml-js'),
        
      stages = require('./stages'), stagesLoggerSpaces = [],
          db = require('./db'),
          
        // short-hand
        exchangerUpdatedAt = ch => ch.xmlStartedAt ? Infinity : (ch.xmlUpdatedAt || 0);

    // whiter to /cached/*.json
    const Cached = {
        json: (name, data) => {
            fs.writeFile('./public/cached/' + name + '.json', JSON.stringify(data, null, 4), _.noop);
            return Cached;
        },
        
        fillAll: () => Cached
            .fillExchangers()
            .fillProcess()
            .pair.fill(),
        
        fillExchangers: () => {
            return Cached.json('exchangers', Exchangers.map(ch => _.omit(ch, [/*"exUrlTmpl", */"xml"])));
        },
        
        fillProcess: () => Cached.json('process', {
            now: new Date,
            queue: {
                pair: Cached.pair.size(),
            },
            node: {
                mem: process.memoryUsage(),
            }
        }),
        
        pair: (() => {
            let touched = [];
            
            return {
                touch: (from, to) => {
                    if (_.isArray(from))
                        return from.forEach(ex => Cached.pair.touch(ex.from, ex.to));
                    
                    const touch = _.find(touched, { from: from, to: to }) || { from: from, to: to, times: 0, created: now() };
                    
                    if (0 === touch.times) touched.push(touch);
                    
                    touch++;
                },
                
                size: () => touched.length,
                
                detouch: (pageSize) => {
                    touched = _.sortBy(touched, [t => t.times, t => - t.created]);
                    return touched.splice(- pageSize, pageSize);
                },
                
                fill: () => Cached.json('pair', touched)
            };
        })()
    };
    
    console.log('Setup with', Exchangers.length, 'exchangers. Start sniffer...');
    
    // start sniff one, ok
    return updateOlderOne();
    
    
    // give a next as oldest updated
    function olderLoaded() {
        return Exchangers
            .filter(ch => ! ch.xmlStartedAt)
            .sort((a,b) => exchangerUpdatedAt(a) - exchangerUpdatedAt(b)) /* O(N * logN) */ [ 0 ]
    };
        
    // request older exchanger's XML + deffered self calling
    async function updateOlderOne () {
        const ch = olderLoaded();
        
        if (! ch) {
            // have no work now, lazy tick, 4000 ms interval
            return setTimeout(updateOlderOne, 4000);
        }
                    
        // init stages
        const { end, begin } = ch.xmlStage = ch.xmlStage || stages(ch); // stages short-hands
        
        // reset with common spaces
        ch.xmlStage.reset({ spaces: stagesLoggerSpaces });
        
        try {
            if (ch.xmlStartedAt) throw 'already run | has no';
            
            ch.xmlUpdatedAt = null;
            ch.xmlStartedAt = +new Date;
            
            begin('fetch');
            const response = await fetch(ch.xml);
            
            begin('text');
            const responseText = await response.text();
            end('text', responseText.length);

            begin('parse');
            const jso = convert.xml2js(responseText, { trim: true, compact: true });
            
            begin('rates');
            const ratesBulk = (jso.rates.item || []).map((rate, i) => {
                rate = _.transform(rate, (r, v, k) => {
                    if (! _.isEmpty(v)) { // igrore <empty/>
	                    if (0 === i && ! v._text) console.warn("Can't parse", k, 'with', v);
	                    r[k] = v._text;
                    }
                });
                
                rate.param = _.transform(rate.param ? rate.param.split(/,\s*/g).sort() : [],
                    (r, v) => r[v] = true, {}); // rate flags as plain { flag: true,.. }
                
                rate.exchangerId = ch.bcId || ch.id;
                
                return rate;
            });
            end('rates', ratesBulk.length);
            
            // clear bulk without duplicates, to be updated
            begin('dups');
            const ratesBulkUniq = _.uniqBy(ratesBulk, r => [r.exchangerId, r.from, r.to].join()), // O(N * logN)
               ratesBulkNotUniq = _.difference(ratesBulk, ratesBulkUniq);
            
            ratesBulkNotUniq.length && end('dups', ratesBulkNotUniq.length);
            
            const ratesBulkClear = ratesBulkUniq;
            
            // update db rates
            begin('db');
            db.then(db => {
                const schema = require('./db.schema');
                
                begin('bulk', ratesBulkClear.length);
                db.models.ExchangeRate
                    .bulkCreate(ratesBulkClear, {
                        validate: true,
                        updateOnDuplicate: _
                            .chain(schema.ExchangeRate.fields).keys()
                            //.difference(schema.ExchangeRate.indexes[0].fields)
                            //.difference(["id"])
                            .value(),
                        logging: false,
                    })
                    .then(updatedPairs => {
                        // touch to pairs
                        begin('touch');
                        try {
                            Cache.pair.touch(ratesBulkClear);
                        } catch(e) {
                            error(e);
                        }
                        end('touch');
            
                        // mark as finished
                        end('all');
                        ch.xmlUpdatedAt = +new Date;
                        
                        // mark as not started
                        ch.xmlStartedAt = null;
                        
                        // fix cached
                        Cached.fillAll();
                        
                        console.log('xml', ch.xmlStage.short(), 'from', ch.xml);
                        
                        // fast tick,
                        // if all right, 500..2000 ms interval
                        setTimeout(updateOlderOne, Math.max(500, 2000 - ch.xmlStage.ms.all));
                    })
                    .catch(error);
            });
        } catch(e) {
            error(e);
        }
        
        function error(e) {
            end('all', e);
            
            // fix cached
            Cached.fillAll();
            
            console.warn('xml', (ch && ch.xml), 'ERROR at', (ch ? ch.xmlStage : '<no exchanger>'), 'with', e);
            
            // lazy tick,
            // after fail, 9000 ms interval
            setTimeout(updateOlderOne, Math.max(9000, 9000 - ch.xmlStage.ms.all));
        }
    }
})(
    JSON.parse(process.env[ "XX_CHANGERS" ]) // todo: setup from db
        .filter(ch => ch.xml && ch.xmlVerified)
);



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// my static, for /cached/*.json
app.use('/cached', express.static(path.join(__dirname, 'public/cached')));


app.use('/*', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
