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
        
        putAll: () => Cached
            .putExchangers()
            .pairs.put()
            // at end
            .putProcessReport(),
        
        putExchangers: () => {
            return Cached.json('exchangers', Exchangers.map(ch => _.omit(ch, [/*"exUrlTmpl", */"xml"])));
        },
        
        putProcessReport: () => Cached.json('process', {
            now: new Date,
            pairs: Cached.pairs.processReport(),
            node: {
                mem: process.memoryUsage(),
            }
        }),
        
        pairs: (() => {
            const touched = {};
            
            return {
                TAIL_CHUNK_SIZE: 100,
                
                // saved in touched[from][to] 
                touch: (from, to) => {
                    if (_.isArray(from))
                        return from.forEach(ex => Cached.pairs.touch(ex.from, ex.to));
                    
                    const
                        fromBranch = touched[from] = touched[from] || {},
                        touch = fromBranch[to] = fromBranch[to]
                            || { from: from, to: to, times: 0, created: +new Date };
                    
                    //if (0 === touch.times) touched.push(touch); // from array-version
                    
                    touch.times++;
                },
                
                processReport: () => {
                    const all = _.flatten(_.values(touched).map(_.values)),
                        oldest = _.min(all, 'created'),
                        greedy = _.max(all, 'times');
                    
                    return oldest && {
                        queue: all.length,
                        oldest: new Date(oldest.created) + ' (' + (+new Date - oldest.created) / 1e3 + ' secs old)',
                        greedy: greedy.times,
                    };
                },
                
                tail: () => {
                    const page = _.flatten(_.map(touched, _.values))
                        .sort((a,b) =>
                            (a.created - b.created) || // how old
                            (a.times - b.times) // many requests
                        )
                        .slice(0, Cached.pairs.TAIL_CHUNK_SIZE);
                    
                    // clear touched, todo: maybe do this after head has been applied?
                    page.forEach(touch => {
                        // hm, write to fs here?
                        // Cached.json(touch.from + '/' + touch.to, )
                        
                        delete touched[touch.from][touch.to];
                    });
                    
                    return page;
                },
                /* correct no =)
                detouch: (pageSize) => {
                    const sortedTouched = _.sortBy(this.plain(), [t => t.times, t => - t.created]);
                    return sortedTouched.splice(- pageSize, pageSize);
                },
                */
                put: () => Cached.json('pair', touched)
            };
        })()
    };
    
    console.log('Setup with', Exchangers.length, 'exchangers. Start sniffer...');
    
    // start pairs json writer
    updateOldestPairsTail();
    
    // start xml sniffer
    return updateOlderOne();
    
    
    // put oldest pairs jsons to fs + deffered self calling (queue)
    function updateOldestPairsTail() {
        const begin = +new Date,
            page = Cached.pairs.tail();
        
        console.log('pairs page of', page.length);
        
        
        // lazy tick,
        // after fail, 5000 ms interval
        setTimeout(updateOldestPairsTail, Math.max(15000, 15000 - (+new Date - begin)));
    }
    
    // give a next as oldest updated
    function olderLoaded() {
        return Exchangers
            .filter(ch => ! ch.xmlStartedAt)
            .sort((a,b) => exchangerUpdatedAt(a) - exchangerUpdatedAt(b)) /* O(N * logN) */ [ 0 ]
    };
        
    // request older exchanger's XML + deffered self calling (queue)
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
                
                // case from=108, to=129 pcs...
                rate.from = rate.from.toUpperCase().trim();
                rate.fix = rate.to.toUpperCase().trim();
                
                return rate;
            });
            end('rates', ratesBulk.length);
            
            // clear bulk without duplicates, to be updated
            begin('dups');
            const ratesBulkUniq = _.uniqBy(ratesBulk, r => [r.exchangerId, r.from, r.to].join()), // O(N * logN)
               ratesBulkNotUniq = _.difference(ratesBulk, ratesBulkUniq);
            
            ratesBulkNotUniq.length && end('dups', ratesBulkNotUniq.length);
            
            const ratesBulkClean = ratesBulkUniq;
            
            // update db rates
            db.then(db => {
                const schema = require('./db.schema');
                
                begin('bulk', ratesBulkClean.length);
                db.models.ExchangeRate
                    .bulkCreate(ratesBulkClean, {
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
                        Cached.pairs.touch(ratesBulkClean);
                        end('touch');
            
                        // mark as finished
                        end('all');
                        ch.xmlUpdatedAt = +new Date;
                        
                        // mark as not started
                        ch.xmlStartedAt = null;
                        
                        // fix cached
                        Cached.putAll();
                        
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
            Cached.putAll();
            
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
