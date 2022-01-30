// init sniffer
(async (Exchangers) => {
    const fs = require('fs'),
           _ = require('lodash'),
       fetch = require('node-fetch'),
     convert = require('xml-js'),
        
      stages = require('./stages'), stagesLoggerSpaces = [],
      dbConn = require('./db'),
          
        // short-hand
        exchangerUpdatedAt = ch => ch.xmlStartedAt ? Infinity : (ch.xmlUpdatedAt || 0),
        
        snifferUpAt = new Date;

    // whiter to /cached/*.json
    const Cached = {
        DIR: './public/cached/',
        
        json: (name, data) => {
            const dir = Cached.DIR + name.split('/').slice(0, -1).join('/');
                
            if (! fs.existsSync(dir)) {
                console.log('mkdir', dir);
                
                fs.mkdirSync(dir, /*0744,*/ { recursive: true });
            }
            
            fs.writeFile(Cached.DIR + name + '.json', JSON.stringify(data, null, 4), _.noop);
            
            return Cached;
        },
        
        putAnyReports: () => Cached
            .putExchangers()
            //.pairs.putPairsJson()
            // at end
            .putProcessReport(),
        
        putExchangers: () => {
            return Cached.json('exchangers', Exchangers.map(ch => _.omit(ch, [/*"exUrlTmpl", */"xml"])));
        },
        
        putProcessReport: async () => {
            const pairsAll = Cached.pairs.all();
            
            let dbReport;
            await dbConn.then(async (db) => {
                //console.log(db)
                dbReport = {
                    exchangers: await db.models.Exchanger.count(),
                    rates: await db.models.ExchangeRate.count(),
                };
            });
            
            return Cached.json('process', {
                up: snifferUpAt,
                now: new Date,
                current: {
                    rates: pairsAll.reduce((sum, touch) => sum + touch.rates.length, 0),
                    pairs: Cached.pairs.processReport(),
                },
                db: dbReport,
                node: {
                    mem: process.memoryUsage(),
                }
            });
        },
        
        pairs: (() => {
            const touchedTree = {};
            
            return {
                DEFAUL_TOUCHED_TAIL_SIZE: 100,
                
                all: () => _.flatten(_.map(touchedTree, _.values)),
                
                touchedAll: () => Cached.pairs.all().filter(touch => touch.updates > 0),
                
                // saved in touched[from][to] 
                touch: (from, to, rate) => {
                    if (_.isArray(from))
                        return from.forEach(rate => Cached.pairs.touch(rate.from, rate.to, rate));
                    
                    const
                        fromBranch = touchedTree[from] = touchedTree[from] || {},
                        fromBranchToTouch = fromBranch[to] = fromBranch[to]
                            //|| console.log('pair', from, 'to', to, 'with', _.keys(fromBranch).sort())
                            || { from: from, to: to, updates: 0, created: +new Date, rates: [] };
                    
                    //if (0 === touch.times) touched.push(touch); // from array-version
                    
                    const rateExchangerId = rate.exchangerId,
                        rateIndex = _.findIndex(fromBranchToTouch.rates, rate => rateExchangerId === rate.exchangerId);
                    
                    if (-1 !== rateIndex) {
                        if (! _.isEqual(fromBranchToTouch.rates[rateIndex], rate)) {
                            fromBranchToTouch.rates[rateIndex] = _.clone(rate);
                            
                            if (! fromBranchToTouch.updates++) {
                                fromBranchToTouch.created = +new Date; // first update
                            }
                        }
                    } else {
                        fromBranchToTouch.rates.push(rate);
                        
                        if (! fromBranchToTouch.updates++) {
                            fromBranchToTouch.created = +new Date; // first update
                        }
                    }
                },
                
                processReport: () => {
                    const touchedAll = Cached.pairs.touchedAll(),
                        oldest = _.min(touchedAll, 'created'),
                        greedy = _.max(touchedAll, 'updates');
                    
                    return oldest && {
                        all: Cached.pairs.all().length,
                        touched: touchedAll.length,
                        oldy_updated: new Date(oldest.created) + ' (' + (+new Date - oldest.created) / 1e3 + ' secs old)',
                        greedy_wants: greedy.updates,
                    };
                },
                
                touchedTail: (size) => {
                    const page = Cached.pairs.touchedAll()
                        .sort((a,b) =>
                            (a.created - b.created) || // how old
                            (a.updates - b.updates) // update requests
                        )
                        .slice(0, size || Cached.pairs.DEFAUL_TOUCHED_TAIL_SIZE);
                    
                    return page;
                },

                //putPairsJson: () => Cached.json('pair', touchedTree),
            };
        })()
    };
    
    console.log('Setup with', Exchangers.length, 'exchangers. Start sniffer...');
    
    // start pairs json writer
    updateOldestPairsTail(0);
    
    // start xml sniffer
    return updateOlderOne();
    
    
    // put oldest pairs jsons to fs + deffered self calling (queue)
    function updateOldestPairsTail(N) {
        const begints = +new Date,
              touches = Cached.pairs.touchedTail(100);
        
        //if (0 === N % 10 && touches.length > 0)
        //    console.log(touches.map(t => t.updates));
        
        touches.forEach((touch, M) => {
            //if (0 === M && 0 === N % 10) console.log(touch);
            
            Cached.json(touch.from + '/' + touch.to, {
                time: new Date,
                rates: touch.rates,
            });
            
            touch.updates = 0;
        });
        
        if (0 === N % 10 && touches.length > 0)
            console.log('tick update', 10 * touches.length, "pairs with rate ~",
                Math.round(1000 * 100 / (+new Date - begints)), 'files.json per second');
        
        
        // too fast tick,
        // after fail, 100 ms interval
        setTimeout(updateOldestPairsTail.bind(this, N + 1), Math.max(
            100, // min delay
            100 // max interval
                - (+new Date - begints),
        ));
    }
    
    // give a next as oldest updatedAt
    function oldestXmlFetchedExchanger() {
        return Exchangers
            .filter(ch => ! ch.xmlStartedAt)
            .sort((a,b) => exchangerUpdatedAt(a) - exchangerUpdatedAt(b)) /* O(N * logN) */ [ 0 ]
    };
        
    // request older exchanger's XML + deffered self calling (queue)
    async function updateOlderOne () {
        const exch = oldestXmlFetchedExchanger();
        
        if (! exch) {
            // have no work now, lazy tick,
            return xmlFinishUp(2000); // min 2000 ms interval
        }
                    
        // init stages
        const { end, begin } = exch.xmlStage = exch.xmlStage || stages(exch); // stages short-hands
        
        // reset with common spaces
        exch.xmlStage.reset({ spaces: stagesLoggerSpaces });
        
        try {
            if (exch.xmlStartedAt) throw 'already run | has no';
            
            exch.xmlUpdatedAt = null;
            exch.xmlStartedAt = +new Date;
            
            begin('fetch');
            const response = await fetch(exch.xml);
            
            begin('text');
            const responseText = await response.text();
            end('text', responseText.length);

            begin('parse');
            const jso = convert.xml2js(responseText, { trim: true, compact: true });
            
            if (! jso || ! jso.rates || ! jso.rates.item) {
                return xmlFinishError();
            }
            
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
                
                rate.exchangerId = exch.bcId || exch.id;
                
                // case from=108, to=129 pcs...
                rate.from = rate.from.toUpperCase().trim();
                rate.fix = rate.to.toUpperCase().trim();
                
                rate.firedAt = +new Date;
                
                return rate;
            });
            end('rates', ratesBulk.length);
            
            // clear bulk without duplicates, to be updated
            //begin('dups'); // min-logs
            const ratesBulkUniq = _.uniqBy(ratesBulk, r => [r.exchangerId, r.from, r.to].join()), // O(N * logN)
               ratesBulkNotUniq = _.difference(ratesBulk, ratesBulkUniq);
            
            //ratesBulkNotUniq.length && end('dups', ratesBulkNotUniq.length);
            
            const ratesBulkClean = ratesBulkUniq;
            
            // update db rates
            dbConn.then(db => {
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
                    .then((affectedRows) => {
                        //console.log('bulkCreateResult', affectedRows);
                        
                        // store count rows
                        
                        
                        // touch to pairs
                        //begin('touch'); // min-logs
                        Cached.pairs.touch(ratesBulkClean);
                        //end('touch'); // min-logs
                        
                        // 
                        xmlFinishUp(1500, 1.0); // interval 1500ms.. to ..50% CPU time
                        
                        // mark as finished
                        exch.xmlUpdatedAt = +new Date;
                        
                        // mark as not started
                        exch.xmlStartedAt = null;
                        
                        console.log('xml', exch.xmlStage.short(), 'from', exch.xml);                        
                    })
                    .catch((e) => {
                        xmlFinishError(e);
                    });
            });
        } catch(e) {
            xmlFinishError(e);
        }
        
        function xmlFinishError(e) {
            xmlFinishUp(5000); // after fail, 9000 ms interval
            
            console.warn('xml', (exch && exch.xml), 'with', e, 'ERROR at', (exch ? exch.xmlStage : '<no exchanger>'));
        }
        
        function xmlFinishUp(maxInterval, minDelay) {
            const MAX_INTERVAL = maxInterval || console.error('xml finished without interval! mf') || 9000, 
                staged = exch && exch.xmlStage,
                xmlTimeAll = staged ? staged.ms.all : 0;
            
            staged && end('all');
            
            // fix cached
            Cached.putAnyReports();
            
            // tick
            setTimeout(updateOlderOne, Math.max(
                xmlTimeAll / (minDelay || .33), // ~75% CPU time max (delay min = 1/3 job time)
                MAX_INTERVAL // max intarval
                    - xmlTimeAll
            ));
        }
    }
})(
    JSON.parse(process.env[ "XX_CHANGERS" ]) // todo: setup from db
        .filter(ch => ch.xml && ch.xmlVerified)
);




var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());




app.use('/table.html', express.static(path.join(__dirname, 'public/table.html')));




app.use(express.static(path.join(__dirname, 'public')));


// static for /cached/*.json
app.use('/cached', express.static(path.join(__dirname, 'public/cached')));

// dynamic for exchange table
const tableRouter = require('./routes/table');
app.use('/table', tableRouter);


// app.use('/', indexRouter);
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
