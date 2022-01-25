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
        parsedAt = ch => ch.xmlStartedAt ? Infinity : (ch.xmlParsedAt || 0),
        
        // give a next as oldest updated
        olderLoaded = () => {
            return changersWithXml
                .sort((a,b) => parsedAt(a) - parsedAt(b)) /* O(N * logN) */ [ 0 ]
        },
        
        updateOlderOne = async () => {
            try {
                const ch = olderLoaded();
                
                if (ch.xmlStartedAt) throw 'already';
                
	            ch.xmlStage = 'new';
                ch.xmlParsedAt = null;
                ch.xmlStartedAt = +new Date;
                
                ch.xmlState = 'fetch';
                const response = await fetch(ch.xml);
                
                ch.xmlStage = 'text';
                const responseText = await response.text();
                //console.log('xml:', ch.xml, '... xml', responseText.length, 'bytes');

                ch.xmlStage = 'xml2js';
                const jso = convert.xml2js(responseText, { trim: true, compact: true });
                
                ch.xmlStage = 'transform';
                const rates = (jso.rates.item || []).map((rate, i) => {
                    rate = _.transform(rate, (r, v, k) => {
                        if (! _.isEmpty(v)) { // igrore <empty/>
    	                    if (0 === i && ! v._text) console.warn("Can't parse", k, 'with', v);
    	                    r[k] = v._text;
	                    }
	                });
                    rate.param = _.transform(rate.param ? rate.param.split(',').sort() : [],
                        (r, v) => r[v] = true, {}); // rate flags as plain object
                    return rate;
                });
                
                // mark as parsed
                ch.xmlParsedAt = +new Date;
                
                ch.xmlStage = 'parsed';
                console.log('xml', ch.xml, 'parsed', rates.length, 'rates at', (ch.xmlParsedAt - ch.xmlStartedAt), 'ms with one', rates[0]);
                
                // unmark as started
                ch.xmlStartedAt = null;
            } catch(e) {
                console.warn('XML', (ch && ch.xml), 'at', (ch ? ch.xmlStage : '<no subject>'), 'with', e);
            }
            
            
            require('./db').connect(db => console.log('db.connect() #4..', !! db));
            
            // tick
            setTimeout(updateOlderOne, 5000);
        };
    
    // todo: setup from db
    console.log('Setup with', initial.length, 'changers, where with verified xml source:', changersWithXml.length);
    
    //process.env[ "XX_CHANGERS_UPD" ] = JSON.stringify(initial);
    // start
    updateOlderOne();
})(
    JSON.parse(process.env[ "XX_CHANGERS" ])
);


// use postgres db
const db = require('./db');
db.connect(db => console.log('db.connect() #0..', db));
db.connect(db => console.log('db.connect() #1..', db));



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
