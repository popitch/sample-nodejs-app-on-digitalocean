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
        
        putAll: () => Cached
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
                    exchangers: await db.models.Exchanger.count({ logging: false }),
                    rates: await db.models.ExchangeRate.count({ logging: false }),
                };
            });
            
            return Cached.json('process', {
                up: snifferUpAt,
                now: new Date,
                jsoncached: {
                    exchangers: Exchangers.length,
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
                
                mapTouchTree: (iterator) => {
                    const result = {};
                    for (let from in touchedTree) {
                        const touchedBranch = touchedTree[from];
                        result[from] = result[from] || {};
                        for (let to in touchedBranch) {
                            const touch = touchedBranch[to];
                            result[from][to] = iterator(touch);
                        }
                    }
                    return result;
                },
                
                // delete rate from touch.rates[]
                deleteRate: (from, to, rate) => {
                    const touch = touchedTree[from][to];
                    touch.rates = touch.rates.filter(r => r !== rate);
                    touch.updates++;
                },
                
                touchedAll: () => Cached.pairs.all().filter(touch => touch.updates > 0),
                
                // saved in touched[from][to] 
                touch: (from, to, rate) => {
                    //if (_.isArray(rate))
                    //    return rate.map(rate => Cached.pairs.touch(from, to, rate));
                    
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
            dbConn.then(async (db) => {
                const schema = require('./db.schema');
                const { Op } = require("sequelize");
                
                begin('delete');
                //const exchangerIds = _.uniq(ratesBulkClean.map(r => r.exchangerId));
                // console.log('delete `exchangeRate` where exchangerId in', exchangerIds);
                const deleteCount = await db.models.ExchangeRate.destroy({ where: { exchangerId: exch.id }, logging: false });
                end('delete', deleteCount);
                
                begin('upsert');
                const affectedRates = await db.models.ExchangeRate
                    .bulkCreate(ratesBulkClean, {
                        validate: true,
                        updateOnDuplicate: _
                            .chain(schema.ExchangeRate.fields).keys()
                            //.difference(schema.ExchangeRate.indexes[0].fields)
                            //.difference(["id"])
                            .value(),
                        logging: false,
                    });
                end('upsert', affectedRates.length);
                
                // touch to pairs
                begin('de/touch'); // min-logs
                const deletingTree = Cached.pairs.mapTouchTree(touch => _.find(touch.rates, r => r.exchangerId === exch.id) || null);
                ratesBulkClean.forEach(rate => {
                    Cached.pairs.touch(rate.from, rate.to, rate);
                    if (deletingTree[rate.from]) {
                        deletingTree[rate.from][rate.to] = null;
                    }
                });
                Cached.pairs.mapTouchTree(touch => {
                    const rate = deletingTree[touch.from] && deletingTree[touch.from][touch.to];
                    if (rate) {
                        Cached.pairs.deleteRate(touch.from, touch.to, rate);
                    }
                });
                end('de/touch', _.values(deletingTree).map(_.values).flat().reduce((s, r) => s + (r ? 1 : 0), 0) + '/' + ratesBulkClean.length); // min-logs
                
                // mark as finished
                exch.xmlUpdatedAt = +new Date;
                
                // mark as not started
                exch.xmlStartedAt = null;
                
                xmlFinishUp(1500, 1.0); // interval 1500ms.. to ..50% CPU time
                
                console.log('xml', exch.xmlStage.short(), 'from', exch.xml); 
            });
        } catch(e) {
            xmlFinishError(e);
        }
        
        function xmlFinishError(e) {
            xmlFinishUp(5000); // after fail, 9000 ms interval
            
            console.warn('xml', (exch && exch.xml), 'with', e, 'ERROR at', (exch ? exch.xmlStage : '<no exchanger>'));
        }
        
        async function xmlFinishUp(maxInterval, minDelay) {
            const MAX_INTERVAL = maxInterval || console.error('xml finished without interval! mf') || 9000, 
                staged = exch && exch.xmlStage,
                xmlTimeAll = staged ? staged.ms.all : 0;
            
            staged && end('all');
            
            // update db with Exchangers
            const affectedExchangers = await db.models.Exchanger
                .bulkCreate(Exchangers, {
                    validate: true,
                    updateOnDuplicate: _.keys(schema.Exchanger.fields),
                    logging: false,
                });
            affectedExchangers &&
                console.warn('Affected exchangers:', affectedExchangers.length);
            
            // fix cached
            Cached.putAll();
            
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
