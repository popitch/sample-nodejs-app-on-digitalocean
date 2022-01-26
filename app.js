var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');



// init sniffer
(async (initial) => {
    const fetch = require('node-fetch'),
        convert = require('xml-js'),
              _ = require('lodash');

    const changersWithXml = initial.filter(c => c.xml && c.xmlVerified),
        updatedAt = ch => ch.xmlStartedAt ? Infinity : (ch.xmlUpdatedAt || 0),
        
        // give a next as oldest updated
        olderLoaded = () => {
            return changersWithXml
                .filter(ch => ! ch.xmlStartedAt)
                .sort((a,b) => updatedAt(a) - updatedAt(b)) /* O(N * logN) */ [ 0 ]
        },
        
    updateOlderOne = async () => {
            const ch = olderLoaded();
                
            try {
                if (ch.xmlStartedAt) throw 'already run';
                
	            ch.xmlStage = 'new';
                ch.xmlUpdatedAt = null;
                ch.xmlStartedAt = +new Date;
                
                ch.xmlState = 'fetch';
                const response = await fetch(ch.xml);
                
                ch.xmlStage = 'text';
                const responseText = await response.text();
                //console.log('xml:', ch.xml, '... xml', responseText.length, 'bytes');

                ch.xmlStage = 'parse';
                const jso = convert.xml2js(responseText, { trim: true, compact: true });
                
                ch.xmlStage = 'transform';
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
                
                ch.xmlStage = 'parsed ' + ratesBulk.length + ' rate(s)';
                
                // clear bulk without duplicates, to be updated
                const ratesBulkUniq = _.uniqBy(ratesBulk, r => [r.exchangerId, r.from, r.to].join()), // O(N * logN)
                    ratesBulkNotUniq = _.difference(ratesBulk, ratesBulkUniq);
                console.warn('Duplicates detected', ratesBulkNotUniq.length, '/', ratesBulk.length, 'rates', 'REMOVING DUPLICATES', ratesBulkNotUniq.length);
                const ratesBulkClear = ratesBulkUniq;
                
                // update db rates
                db.then(db => {
                    const schema = require('./db.schema');
                    
                    //console.log('bulk', ratesBulk.slice(0, 2));

                    ch.xmlStage = 'bulk ' + ratesBulkClear.length + ' rate(s)';
                    db.models.ExchangeRate
                        .bulkCreate(ratesBulkClear, {
                            validate: true,
                            updateOnDuplicate: _
                                .chain(schema.ExchangeRate.fields).keys()
                                .difference(schema.ExchangeRate.indexes[0].fields)
                                .difference(["id"])
                                .value(),
                            logging: false,
                        })
                        .then(() => {
                            // mark as finished
                            ch.xmlStage = null;
                            ch.xmlUpdatedAt = +new Date;
                            console.log('xml', ch.xml, 'load/parse/update', ratesBulkClear.length, 'rates /', (ch.xmlUpdatedAt - ch.xmlStartedAt), 'ms');
                            
                            // mark as not started
                            ch.xmlStartedAt = null;
                            
                            // fast tick, if all right
                            setTimeout(updateOlderOne, 3000);
                        })
                        .catch(error);
                });
            } catch(e) {
                error(e);
            }
            
            function error(e) {
                console.warn('XML', (ch && ch.xml), 'at', (ch ? ch.xmlStage : '<no exchanger>'),
                        'with', e && e.length > 5 ? e.slice(0, 5).concat(['........']) : e);
                
                ch.xmlStage = e;
                
                // lazy tick, after fail
                //setTimeout(updateOlderOne, 5000);
            }
        };
    
    // todo: setup from db
    console.log('Setup with', initial.length, 'changers, where with verified xml source:', changersWithXml.length);
    
    //process.env[ "XX_CHANGERS_UPD" ] = JSON.stringify(initial);
    // start
    updateOlderOne();
})(
    JSON.parse(process.env[ "XX_CHANGERS" ])
);


// db
const db = require('./db');
db.then(db => console.log('db.then((db => #1 ..)', !! db));
db.then(db => console.log('db.then((db => #2 ..)', !! db));
//db.then(db => console.log('db.then((db => #3 ..)', !! db));



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
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
