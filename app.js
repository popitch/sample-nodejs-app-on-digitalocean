var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

const fs = require('fs'),
  stages = require('./stages'),
      db = require('./db');

// init sniffer
(async (initial) => {
    const fetch = require('node-fetch'),
        convert = require('xml-js'),
              _ = require('lodash');

    const
        exchangersWithXml = initial.filter(c => c.xml && c.xmlVerified),
        
        // whiter to /cached/*.json
        cached = {
            json: (name, data) => {
                fs.writeFile('./public/cached/' + name + '.json', JSON.stringify(data, null, 4), _.noop);
                return cached;
            },
            exchangers: () => {
                return cached.json('exchangers', exchangersWithXml.map(ch => _.omit(ch, [/*"exUrlTmpl", */"xml"])));
            },
            process: () => cached.json('process', process.memoryUsage()),
            pair: {
                _touched: {},
                
            }
        },
        
        updatedAt = ch => ch.xmlStartedAt ? Infinity : (ch.xmlUpdatedAt || 0),
        
        // give a next as oldest updated
        olderLoaded = () => {
            return exchangersWithXml
                .filter(ch => ! ch.xmlStartedAt)
                .sort((a,b) => updatedAt(a) - updatedAt(b)) /* O(N * logN) */ [ 0 ]
        },
        
        // request older exchanger's XML + deffered self calling
        updateOlderOne = async () => {
            const ch = olderLoaded();
            
            if (! ch) {
                // have no work now, lazy tick, 4000 ms interval
                return setTimeout(updateOlderOne, 4000);
            }
                        
            // init stages
            const { end, begin } = ch.xmlStage = ch.xmlStage || stages(ch); // stages short-hands
            ch.xmlStage.reset();
            
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
                        .then(() => {
                            // mark as finished
                            end('bulk');
                            end('all');
                            ch.xmlUpdatedAt = +new Date;
                            
                            // mark as not started
                            ch.xmlStartedAt = null;
                            
                            // fix cached
                            cached.exchangers().process();
                            
                            console.log('.xml', ch.xmlStage.short(), 'from', ch.xml);
                            
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
                cached.exchangers().process();
                
                console.warn('xml', (ch && ch.xml), 'ERROR at', (ch ? ch.xmlStage : '<no exchanger>'));
                
                // lazy tick,
                // after fail, 5000 ms interval
                setTimeout(updateOlderOne, Math.max(5000, 5000 - ch.xmlStage.ms.all));
            }
        };
    
    // todo: setup from db
    console.log('Setup with', initial.length, 'changers, where with verified xml source:', exchangersWithXml.length);
    
    //process.env[ "XX_CHANGERS_UPD" ] = JSON.stringify(initial);
    // start
    updateOlderOne();
})(
    JSON.parse(process.env[ "XX_CHANGERS" ])
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
