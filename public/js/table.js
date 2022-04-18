// persist version of $.getJSON(repeatTimes: number, ...)
$.getJSON = _.wrap($.getJSON, function(getJSON, N) {
    let args = _.tail(arguments);
    if (! _.isNumber(N)) {
        return getJSON.apply($, args); // 
    }
    args = _.tail(args);
    return getJSON.apply($, args)
        .catch(e => {
            // console.warn(N + '.. getJSON(', args, ') with', e);
            if (--N > 0) {
                setTimeout(() => $.getJSON.apply($, [N].concat(args)), 400);
            }
        });
});

const
    // self-searchString config
    TABLE_JS_CONFIG = (() => {
        const tableJs = [].find.call(document.getElementsByTagName('script'), (s) => s.src.match(/table\.js/));
        if (tableJs) {
            const config = (tableJs.src.split('?').slice(1).join('?') || '')
                .split('&')
                .filter(p => p)
                .reduce((config, pair) => (pair = pair.split('='), config[pair[0]] = pair[1] || true, config), {});
            
            console.log('<script src="table.js">', tableJs, 'with params', config);
            return config;
        }
    })(),
    
    // stub data for no db mode
    TABLE_STUB_DATA = [{
        exchangerId: 1,
        param: { card2card: true, manual: true },
        from: "BTC",
        to: "SBERRUB",
        in: 1,
        out: numberWithSpaces(3330303.3, 3),
        amount: numberWithSpaces(303.3, 4),
    }, {
        exchangerId: 743,
        param: { percent: true }, 
        from: "BTC",
        to: "SBERRUB",
        in: 1,
        out: numberWithSpaces(3366703.035, 3),
        amount: numberWithSpaces(2400.3045, 4),
    }],
    
    // mixed config
    PAIRS_PERSISTENCE_TIMES = 2, // 4
    EXCHS_PERSISTENCE_TIMES = 2, // 4
    PAIRS_RENEW_INTERVAL = 1000 * 150, // 15 seconds
    
    EXCHANGERS = (list => {
        const req = () => $.getJSON(EXCHS_PERSISTENCE_TIMES, './cached/exchangers.json', list);
        return req() && list;
    })(ko.observableArray()),
    
    EXCHANGER_BY_ID = ko.computed(() => {
        const byId = {};
        EXCHANGERS().forEach(exch => byId[exch.id] = exch);
        return byId;
    }),
    
    exchangerExchangeUrl = (rate, exch) => {
        const FROM = rate.from, TO = rate.to,
            tr = {
                FROM: FROM,
                from: FROM.toLowerCase(),
                TO: TO,
                to: TO.toLowerCase(),
                "from-full": "from-full ok",
                "to-full": "to-full ok",
                "rid": 'ANY_MORE_GET_PARAM_RID',
                'referral_code': 'ANY_TOO_REFERRAL_CODE',
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
                            read: () =>
                                from() && to() &&
                                    from().toLowerCase() + '-to-' + to().toLowerCase()
                                        + '#' + (sortBy() ? (sortDir() === 'desc' ? '↓' : '↑') + sortBy() : ''),
                            
                            //read: () => from() + '→' + to() + (sortBy() ? (sortDir() === 'desc' ? '↓' : '↑') + sortBy() : ''),
                            
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
                            deferEvaluation: true,
                        });
                    
                    url.subscribe(url => {
                        if (url) location.href = url; // translate to /href#hash combo
                    });
                    //url.subscribe(url => location.hash = url); // translate to #hash
                    
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
                
                //console.log('dir', dir);
                
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
        
        CURRENCY_LIST_EVENTS: (aside) => {
            const $cont = $(aside);
            let leaveTimeout;
            
            // initial scroll
            scroll();
            
            return {
                mouseover: () => {
                    //console.log('mouseover', 'clearTimeout()');
                    $cont.stop();
                    clearTimeout(leaveTimeout);
                },
                mouseleave: scroll,
            };
            
            function scroll(exchangeRates, event) {
                leaveTimeout = setTimeout(() => {
                    const $selected = $cont.find(':radio:checked').parent();
                    if (! $selected[0]) {
                        scroll(exchangeRates, event);
                        return;
                    }
                    const selectedPosition = $selected.offset().top + $cont.scrollTop();
                    
                    $cont.stop().animate({
                        scrollTop: selectedPosition - .38 * $cont.height()
                    }, 500, 'swing');
                    
                    //console.log(event ? event.type : 'initial', $selected[0], selectedPosition, '/', $cont.height());
                }, 400);
            }
        },
    },
    
    PAIRS = (() => {
        const reload = (p) => {
                // update pairs value with .selected screen-position restoration
                $.getJSON(PAIRS_PERSISTENCE_TIMES, './cached/pairs.json', (pp) => {
                    const reduce = (reducer, start) =>
                                $('.rates aside .selected').get()
                                    .reduce(function(accum) { reducer.apply(this, arguments); return accum }, start),
                        offsets = reduce((offsets, sel, i) => offsets[i] = $(sel).offset().top, []);
                    
                    pairs(pp); // <- render here
                    
                    reduce((__, sel, i) => {
                        const offsetYDelta = $(sel).offset().top - offsets[i],
                            $aside = $(sel).closest('aside');
                        
                        //if (p !== pairs)
                        //    debugger;
                        
                        if (offsetYDelta) {
                            console.log('offsetYDelta', offsetYDelta);
                            $aside.scrollTop( $aside.scrollTop() + offsetYDelta );
                        }
                    });
                });
                return pairs;
            },
            pairs = _.extend(ko.observableArray(), { reload });
        
        setInterval(reload, PAIRS_RENEW_INTERVAL);
        
        return reload(pairs);
    })(),
    
    PAIRS_FROM = ko.computed(() => pairsToCurrenciesFrom(PAIRS()), this, { deferEvaluation: true }),
    
    PAIRS_TO = ko.computed(() => pairsToCurrenciesTo(PAIRS()), this, { deferEvaluation: true }),
    
    /*
    CURRENCY_SYMBOLS = ['KodGARANTEX', 'CARDRUB', 'BTC', 'SBERRUB', 'ACRUB', 'TCSBRUB', 'TBRUB', 'P24UAH', 'USDTTRC20', 'USDTERC', 'PMUSD', 'MONOBUAH', 'WHTBTUSDT', 'CARDUAH', 'USDTBEP20', 'YAMRUB', 'PRRUB', 'ETH', 'GRNTXRUB', 'QWRUB'],    
    CURRENCY_LIST = CURRENCY_SYMBOLS.map(symbol => {
        const id = CURRENCY_ID_BY_SYMBOL[symbol];
        return {
            id: id,
            name: CURRENCY_NAME_BY_SYMBOL[symbol] || '`' + symbol + '`',
            symbol: symbol,
        };
    }),
    */
    
    RENEW_DELAY = 7000, // ms
    
    UNITY_BY_PAIR = {},
    
    request = (done) => {
        clearTimeout(renewTimeout);
        
        const lastRequestTime = +new Date,
            from = exchangeRates.filter.from(),
            to = exchangeRates.filter.to();
        
        exchangeRates.loading(true);
        ratesXHR = 
        $.getJSON('./cached/' + from + '/' + to + '.json')
            .done(jso => {
                const rates = jso.rates || [];
                //console.log('rates', rates, 'as sample of', samples);
                
                // unity-side detector
                UNITY_BY_PAIR[from] ||= {};
                const unitySide = UNITY_BY_PAIR[from][to] =
                    _.has(UNITY_BY_PAIR[from], to) ? UNITY_BY_PAIR[from][to] : // if early detected
                        _.all(rates, r => r.in <= r.out) && 'from' ||
                        _.all(rates, r => r.out <= r.in) && 'to' ||
                        false;
                
                // unity-side equalizer
                const equalizeUnitySide =
                    unitySide === 'from' && (rate => { rate.out = (rate.out / rate.in).toFixed(4); rate.in = 1 }) ||
                    unitySide === 'to' && (rate => { rate.in = (rate.in / rate.out).toFixed(4); rate.out = 1 }) ||
                    _.noop;
                
                exchangeRates.rates(
                    rates.map(rate => {
                        equalizeUnitySide(rate);
                        
                        // fixed(4) amount
                        rate.amount = Math.round(rate.amount * 10000) / 10000;
                        
                        return rate;
                    })
                );
                
                exchangeRates.loading(false);
                more();
            })
            .catch(e => {
                //console.warn('wow, error', e);
                exchangeRates.loading(false);
                exchangeRates.rates([]);
                more();
            });
        
        // renew request
        const more = () => renewTimeout = setTimeout(request, lastRequestTime + RENEW_DELAY - +new Date);
    };

var renewTimeout;

// page init
$(() => {
    /*/ sticky thead
    document.addEventListener('sticky-change', e => {
        const header = e.detail.target;  // header became sticky or stopped sticking.
        const sticking = e.detail.stuck; // true when header is sticky.
        
        header.classList.toggle('sticking', sticking); // add drop shadow when sticking.
    
        //document.querySelector('.who-is-sticking').textContent = header.textContent;
    });
    //*/
    
    request();
    ko.applyBindings(exchangeRates, document.head);
    ko.applyBindings(exchangeRates, document.body);
});
