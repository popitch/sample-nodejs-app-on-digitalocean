const
    EXCHANGERS = (list =>
        $.getJSON('./cached/exchangers.json', list)
    && list)(
        ko.observableArray()
    ),
    
    EXCHANGER_BY_ID = ko.computed(() => {
        const byId = {};
        EXCHANGERS().forEach(exch => byId[exch.id] = exch);
        return byId;
    }),
    
    rateExchangeUrl = (rate, exch) => {
        const FROM = rate.from, TO = rate.to,
            tr = {
                FROM: FROM,
                from: FROM.toLowerCase(),
                TO: TO,
                to: TO.toLowerCase(),
                "from-full": "from-full ok",
                "to-full": "to-full ok",
                "rid": 'ANY_MORE_GET_PARAM_RID',
            },
            unknown = [],
            url = exch.exUrlTmpl.replace(/\{([\w-]+)\}/g, (full, key) => tr[key] || unknown.push(key));
        
        if (unknown.length > 0)
            console.warn('unknown parentesses {', unknown, '} in the url', url);
        
        return url;
    },
    
    RATE_VALUE_ACCESSORS = {
        changer: rate => rate.changer,
        from: rate => rate.in,
        to: rate => rate.out,
        amount: rate => rate.amount,
    },
    
    exchangeRates = {
        filter: (() => {
            const from = ko.observable(),
                to = ko.observable(),
                from_to = ko.computed(() => (from() + '_to_' + to()).toLowerCase()),
                
                sortBy = ko.observable(),
                sortDir = ko.observable();
            
            from_to.subscribe(_.throttle(ft => {
                //console.log('from_to =', ft);
                request();
            }, 200, { leading: false }));
            
            return {
                from: from,
                to: to,
                from_to: from_to,
                
                sortBy: sortBy,
                sortDir: sortDir,
                
                toSort: (col) => {
                    if (sortBy() === col) {
                        // switch dir
                        sortDir( sortDir() === 'desc' ? 'asc' : 'desc' );
                    } else {
                        // switch col
                        sortBy(col);
                    }
                },
                sorter: () => RATE_VALUE_ACCESSORS[ sortBy() ],
                
                // ЧПУ
                url: (() => {
                    const
                        //URL_DEFAULT = 'BTC→ETH↓to',
                        URL_DEFAULT = 'BTC→SBERRUB↓to',
                        URL_MATCHER = /^(\w+)→(\w+)(?:(↓|↑)(changer|from|to|amount))?$/,
                        
                        url = ko.computed({
                            read: () => from() + '→' + to() + (sortBy() ? (sortDir() === 'desc' ? '↓' : '↑') + sortBy() : ''),
                            write: (route) => {
                                const matches = decodeURIComponent(route).match(URL_MATCHER);
                                
                                if (!matches) {
                                    console.warn('Bad URL given:', route, '=> to use default filter');
                                    url(URL_DEFAULT); // use default
                                    return;
                                }
                                
                                console.log('URL parsed with: from, to, dir, sort', matches);
                                
                                from(matches[1]);
                                to(matches[2]);
                                sortDir(matches[3] === '↓' ? 'desc' : 'asc');
                                sortBy(matches[4]);
                            },
                        });
                    
                    url.subscribe(url => location.hash = url); // translate to #hash
                    
                    // init from URL #hash
                    url(
                        (location.hash || '#' + URL_DEFAULT).substr(1)
                    );
                    
                    /*shabby/ initial
                    //from(localStorage.getItem('rates.currency.from') || 'BTC');
                    //to(localStorage.getItem('rates.currency.to') || 'ETH');
                    //sortBy(localStorage.getItem('rates.sort.by') || 'to');
                    //sortDir(localStorage.getItem('rates.sort.dir') || 'desc');
                    */
                    
                    return url;
                })(),
            };
        })(),
        
        loading: ko.observable(),
        
        rates: (() => {
            const rates = ko.observableArray([]),
                MAX_FRACTION_LENGTH_FIELDS = ['from', 'to', 'amount'];
            
            // sorted by
            rates.sortedDirected = ko.computed(() => {
                const sorter = exchangeRates.filter.sorter(),
                    dir = exchangeRates.filter.sortDir(),
                    sorted = _.sortBy(rates(), sorter);
                
                console.log('dir', dir);
                
                return dir === 'desc' ? sorted.reverse() : sorted;
            }, this, { deferEvaluation: true });
            
            // max frac len by key
            rates.MAX_FRACTION_LENGTH_BY = ko.computed(
                () => MAX_FRACTION_LENGTH_FIELDS
                    .reduce((mflby, key) => {
                        mflby[key] = _.max(
                            rates()
                                .map(RATE_VALUE_ACCESSORS[key])
                                .map(String)
                                .map(s => s.split('.', 2)[ 1 ])
                                .map(s => (s || '').length)
                        );
                        return mflby;
                    }, {}),
                this, { deferEvaluation: true }
            );
            
            // sorted, directed and fixed floating point
            rates.sortedDirectedFixedFloating = ko.computed(() => {
                const mflby = rates.MAX_FRACTION_LENGTH_BY();
                
                return rates.sortedDirected()
                    .map(rate => _.extend(_.clone(rate), {
                        in: numberWithSpaces(rate["in"], mflby["from"]),
                        out: numberWithSpaces(rate["out"], mflby["to"]),
                        amount: numberWithSpaces(rate["amount"], mflby["amount"]),
                        exchanger: EXCHANGER_BY_ID[rate.exchangerId],
                    }));
            }, this, { deferEvaluation: true });
            
            // rates table
            rates.table = ko.observableArray([]);
            
            // "diff"-style replace
            rates.sortedDirectedFixedFloating.subscribe(table => {
                rates.table.splice.call(rates.table, [0, rates.table().length].concat(table));
            }, this, { deferEvaluation: true });
            
            return rates;
        })(),
    },
    
    PAIRS = (() => {
        const pairs = ko.observableArray();
        $.getJSON('./cached/pairs.json', pairs);
        return pairs;
    })(),
    
    PAIRS_FROM = ko.computed(() => {
        return _.chain(PAIRS())
            .map((branch, from) => ({
                id: CURRENCY_ID_BY_SYMBOL[from],
                name: CURRENCY_NAME_BY_SYMBOL[from] || '"' + from + '"',
                symbol: from,
                weight: _.reduce(branch, (s, w) => s + w, 0),
            }))
            .sortBy(p => - p.weight)
            .value();
    }, this, { deferEvaluation: true }),
    
    PAIRS_TO = ko.computed(() => {
        const tree = PAIRS(),
            toAll = _.chain(tree).map(branch =>
                _.map((w, to) => ({
                    id: CURRENCY_ID_BY_SYMBOL[to],
                    name: CURRENCY_NAME_BY_SYMBOL[to] || '"' + to + '"',
                    symbol: to,
                    weight: w,
                }))
            )
            .flatten()
            .value();
        
        return _.chain(toAll)
            .groupBy('symbol')
            .map((group, to) => _.extend(group[0], {
                weight: group.reduce((w, to) => w + to.weight, 0),
            }))
            .sortBy(p => - p.weight)
            .value();
    }, this, { deferEvaluation: true }),
    
    CURRENCY_SYMBOLS = ['KodGARANTEX', 'CARDRUB', 'BTC', 'SBERRUB', 'ACRUB', 'TCSBRUB', 'TBRUB', 'P24UAH', 'USDTTRC20', 'USDTERC', 'PMUSD', 'MONOBUAH', 'WHTBTUSDT', 'CARDUAH', 'USDTBEP20', 'YAMRUB', 'PRRUB', 'ETH', 'GRNTXRUB', 'QWRUB'],    
    CURRENCY_LIST = CURRENCY_SYMBOLS.map(symbol => {
        const id = CURRENCY_ID_BY_SYMBOL[symbol];
        return {
            id: id,
            name: CURRENCY_NAME_BY_SYMBOL[symbol] || '`' + symbol + '`',
            symbol: symbol,
        };
    }),
    RENEW_DELAY = 3000, // ms
    
    request = (done) => {
        clearTimeout(renewTimeout);
        
        const lastRequestTime = +new Date;
        
        exchangeRates.loading(true);
        ratesXHR = 
        $.getJSON('./cached/' + exchangeRates.filter.from() + '/' + exchangeRates.filter.to() + '.json')
            .done(jso => {
                const rates = jso.rates || [];
                //console.log('rates', rates, 'as sample of', samples);
                
                exchangeRates.rates(rates.map(rate => {
                    rate.amount = Math.round(rate.amount * 10000) / 10000;
                    return rate;
                }));
                
                exchangeRates.loading(false);
                
                more();
            })
            .catch(e => {
                console.warn('wow, error', e);
                exchangeRates.rates([]);
                more();
            });
        
        // renew request
        const more = () => renewTimeout = setTimeout(request, lastRequestTime + RENEW_DELAY - +new Date);
    };

var renewTimeout;

// page init
$(() => {
    request();
    ko.applyBindings(exchangeRates, document.body);
});