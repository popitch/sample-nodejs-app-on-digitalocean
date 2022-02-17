const { dbConn, db } = require('./db');

const fs = require('fs'),
       _ = require('lodash'),
   fetch = require('node-fetch'),
 convert = require('xml-js');

// load exchangers all
const Exchangers = [];
(async () => { // transit O_o
    const list = await db.models.Exchanger.findAll({ where: { xmlVerified: true } });
    for (let one; one = list.shift(); Exchangers.push(one));
})();

// transcript date values
Exchangers.forEach(exch => {
    exch.createdAt = exch.createdAt && new Date(exch.createdAt);
    exch.updatedAt = exch.updatedAt && new Date(exch.updatedAt);
    exch.xmlStartedAt = null; // reset value at init! // exch.xmlStartedAt && new Date(Number(exch.xmlStartedAt) || exch.xmlStartedAt);
    exch.xmlParsedAt = exch.xmlParsedAt && new Date(Number(exch.xmlParsedAt) || exch.xmlParsedAt);
});

module.exports = {
    touchPairsByExchangerId: () => _.groupBy(Cached.pairs.touchedAll(), 'exchangerId'),
};

// writer of /cached/(*).json
const Cached = {
    DIR: './public/cached/',
    
    putJson: (name, data) => {
        const dir = Cached.DIR + name.split('/').slice(0, -1).join('/');
            
        if (! fs.existsSync(dir)) {
            console.log('mkdir', dir);
            
            fs.mkdirSync(dir, /*0744,*/ { recursive: true });
        }
        
        fs.writeFile(Cached.DIR + name + '.json', JSON.stringify(data, null, 4), _.noop);
        
        return Cached;
    },
    
    putAll: () => {
        Cached.putExchangers();
        
        Cached.pairs.putPairsJson();
        
        // at end
        Cached.putProcessReport();
    },
    
    putExchangers: () => {
        return Cached.putJson('exchangers', Exchangers.map(
            exch => _.omit(exch.dataValues, [/*"exUrlTmpl", */"xml"])
        ));
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
        
        return Cached.putJson('process', {
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
            DEFAULT_TOUCHED_TAIL_SIZE: 100,
            
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
                    .slice(0, size || Cached.pairs.DEFAULT_TOUCHED_TAIL_SIZE);
                
                return page;
            },

            putPairsJson: () => Cached.putJson('pairs', Cached.pairs.mapTouchTree(touch => touch.rates.length)),
        };
    })()
};

dbConn.then(async (db) => {
    const
        makeStages = require('./stages'), stagesLoggerSpaces = [],
        schema = require('./db.schema'),
          
        // short-hand
        exchangerUpdatedAt = (exch) => exch.xmlStartedAt ? Infinity : (+new Date(exch.xmlUpdatedAt) || 0),
        
        snifferUpAt = new Date;

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
            
            Cached.putJson(touch.from + '/' + touch.to, {
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
        return _.chain(Exchangers)
            .filter(exch => exch.xml && exch.xmlVerified)
            .filter(exch => ! exch.xmlStartedAt)
            //.sort((a,b) => exchangerUpdatedAt(a) - exchangerUpdatedAt(b)) /* O(N * logN) */ [ 0 ]
            .sortBy(exchangerUpdatedAt) /* O(N * logN) */
            .value()[ 0 ]
    }
        
    // request older exchanger's XML + deffered self calling (queue)
    async function updateOlderOne () {
        const exch = oldestXmlFetchedExchanger();
        
        if (! exch) {
            // have no work now, lazy tick,
            return xmlFinishUp(2000); // min 2000 ms interval
        }
                    
        // init stages
        const { end, begin } = exch.xmlStage
            = exch.xmlStage && exch.xmlStage.reset ? exch.xmlStage : makeStages(exch); // stages short-hands
        
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
                begin('delete');
                //const exchangerIds = _.uniq(ratesBulkClean.map(r => r.exchangerId));
                // console.log('delete `exchangeRate` where exchangerId in', exchangerIds);
                const deleteCount = await db.models.ExchangeRate.destroy({ where: { exchangerId: exch.id }, logging: false });
                end('delete', deleteCount);
                
                begin('upsert');
                const affectedRates = await db.models.ExchangeRate
                    .bulkCreate(ratesBulkClean, {
                        validate: true,
                        updateOnDuplicate: _.keys(schema.ExchangeRate.fields),
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
            try {
                /*
                for (var i = 0; i < Exchangers.length; i++) {
                    const affectedExchangers = await db.models.Exchanger
                        .bulkCreate([ Exchangers[i] ], {
                            validate: true,
                            //updateOnDuplicate: _.keys(schema.Exchanger.fields),
                                //[ "xmlStartedAt", "xmlStage", "xmlParsedAt" ],
                            logging: false,
                        });
            
                    affectedExchangers.length &&
                        console.warn('Affected exchanger', Exchangers[i]);
                }
                */
                await exch.save();
            } catch(e) {
                console.warn('NOT Affected exchangers with error', e, 'with', Exchangers[i]);
            }
            //*/
            //db.models.Exchanger.build(exch);
            
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
}).catch(console.error);
                                                                                                                                                                                                                                                                                                                        