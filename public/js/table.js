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
    jsConfig = (() => {
        const tableJs = [].find.call(document.getElementsByTagName('script'), (s) => s.src.match(/table\.js/));
        if (tableJs) {
            const config = (tableJs.src.split('?').slice(1).join('?') || '')
                .split('&')
                .filter(p => p)
                .reduce((config, pair) => (pair = pair.split('='), config[pair[0]] = pair[1] || true, config), {});
            
            //console.log('<script src="table.js">', tableJs, 'with params', config);
            return (key, defaults) => config[key] || defaults;
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
    
    RATE_VALUE_ACCESSORS = {
        changer: rate => rate.changer,
        from: rate => rate.in,
        to: rate => rate.out,
        amount: rate => rate.amount,
    },
    
    exchangeRates = {
        page: {
            TITLE_TEMPL: _.template('Обмен <%= from %> на <%= to %>'),
            title: ko.lazy(() => {
                const to = exchangeRates.filter.to(),
                    from = exchangeRates.filter.from();
                
                return exchangeRates.page.TITLE_TEMPL({
                    from: CURRENCY_NAME_BY_SYMBOL[from] || from,
                    to: CURRENCY_NAME_BY_SYMBOL[to] || to,
                })
            }),
            pageInited: false,
        },
        
        filter: (() => {
            const
                from    = ko.observable(jsConfig('from')),
                to      = ko.observable(jsConfig('to')),
                from_to = ko.computed(() => (from() + '_to_' + to()).toLowerCase()),
                
                sort = decodeURIComponent(location.hash.substr(1)).split(/\b/),
                sortBy  = ko.observable(jsConfig('by', sort[1] || 'to')), // last val is defaults
                sortDir = ko.observable(jsConfig('dir', sort[0] === '↑' ? 'asc' : 'desc')); // last val is defaults
            
            // subscribe to from|to change
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
                        //URL_DEFAULT = 'BTC→SBERRUB↓to',
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
                                    //url(URL_DEFAULT); // use default
                                    return;
                                }
                                
                                console.log('URL parsed with: from, to, dir, by', matches);
                                
                                sortBy(matches[4]);
                                sortDir(matches[3] === '↓' ? 'desc' : 'asc');
                                to(matches[2]);
                                from(matches[1]);
                            },
                            deferEvaluation: true,
                        });
                    
                    url.subscribe(url => {
                        // translate to /href#hash combo
                        if (!url) return;
                         
                        // location.href = url;
                        
                        history.pushState({}, exchangeRates.page.title(), url);
                    });
                    //url.subscribe(url => location.hash = url); // translate to #hash
                    
                    // init from URL #hash
                    //url(
                    //    (location.hash || '#' + URL_DEFAULT).substr(1)
                    //);
                    
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
            rates.sortedDirected = ko.lazy(() => {
                const sorter = exchangeRates.filter.sorter(),
                    dir = exchangeRates.filter.sortDir(),
                    sorted = _.sortBy(rates(), sorter);
                
                //console.log('dir', dir);
                
                return dir === 'desc' ? sorted.reverse() : sorted;
            });
            
            // max frac len by key
            rates.MAX_FRACTION_LENGTH_BY = ko.lazy(() =>
                MAX_FRACTION_LENGTH_FIELDS
                    .reduce((mflby, key) => {
                        mflby[key] = _.max(
                            rates()
                                .map(RATE_VALUE_ACCESSORS[key])
                                .map(String)
                                .map(s => s.split('.', 2)[ 1 ])
                                .map(s => (s || '').length)
                        );
                        return mflby;
                    }, {})
            );
            
            // sorted, directed and fixed floating point
            rates.sortedDirectedFixedFloating = ko.lazy(() => {
                const mflby = rates.MAX_FRACTION_LENGTH_BY();
                
                return rates.sortedDirected()
                    .map(rate => _.extend(_.clone(rate), {
                        in: numberWithSpaces(rate["in"], mflby["from"]),
                        out: numberWithSpaces(rate["out"], mflby["to"]),
                        amount: numberWithSpaces(rate["amount"], mflby["amount"]),
                        exchanger: EXCHANGER_BY_ID[rate.exchangerId],
                    }));
            });
            
            // rates table
            rates.mutableRowsArray = (() => {
                const rows = ko.observableArray([]);
                
                return ko.lazy(() => {
                    let lastRowIndex = -1,
                        __source = rows().map(_.clone),
                        
                        NOW = (d=new Date, ('0' + d.getMinutes()).substr(-2) + ':' + ('0' + d.getSeconds()).substr(-2)),
                        log = (...args) => console.log(NOW, ...args);
                
                    // update futureRows
                    const
                        MUTABLE_KEYS = ["in", "out", "amount"],
                        futureRows = rates.sortedDirectedFixedFloating().map(data => {
                            const key = [data.from, data.to, data.exchangerId].join(),
                                pastIndex = _.findIndex(rows(), row => row.key === key, lastRowIndex + 1);
                            
                            if (-1 !== pastIndex) {
                                lastRowIndex = pastIndex;
                            }
                            
                            // mutable observable row
                            const row = _.clone(data);
                            MUTABLE_KEYS.forEach(key => row[key] = ko.observable(data[key]));
                            
                            function update(data) {
                                _.each(data, (value, key) => {
                                    if (ko.isObservable(row[key]))
                                        row[key]( ko.unwrap(value) );
                                    else
                                        row[key] = value;
                                });
                            }
                            function rowValue() {
                                return {
                                    from: row.from,
                                    to: row.to,
                                    exchangerId: row.exchangerId,
                                    in: row.in(),
                                    out: row.out(),
                                    amount: row.amount(),
                                };
                            }
                            
                            return _.extend(ko.observable(row), { key, pastRow: rows()[pastIndex], update, value: rowValue });
                        });
                    
                    const __target = futureRows.map(ko.unwrap).map(_.clone);
                    
                    //console.log('mutation array: keys', futureRows.map((r) => [r.key, !!r.pastRow]));
                    
                    /*if (0 === rows().length) {
                        // simple init
                        rows(futureRows);
                    }
                    else {*/
                    
                    // diff-styled replace rows with next array
                    futureRows.forEach((futureRow, index) => {
                        if (futureRow.pastRow) {
                            while (rows()[index] !== futureRow.pastRow) {
                                if (index < rows().length) {
                                    log('mutable: push one', index, '->', futureRow());
                                    // push new one to end
                                    rows.push(futureRow);
                                    return;
                                }
                                log('mutable: remove past one', index, '->', ko.unwrap(rows()[index]));
                                if (! rows()[index]) { debugger; return console.error('fkn mutable))'); }
                                // remove past one
                                rows.splice(index, 1);
                            }
                            // here (rows()[index] === futureRow.pastRow)
                            const row = rows()[index];
                            
                            if (! _.isEqual(row.value(), futureRow.value())) {
                                log('mutable: replace', index, '->', futureRow());
                                // replace current one with next value
                                row/*futureRow.pastRow*/.update(futureRow());
                                //futureRow.pastRow(futureRow());
                            }
                        }
                        else {
                            log('mutable: insert new one', index, '->', futureRow());
                            // insert new one
                            rows.splice(index, 0, futureRow);
                        }
                    });
                    
                    const tailSize = rows().length - futureRows.length
                    if (tailSize > 0) {
                        log('mutable: remove tail with size', tailSize);
                        // remove old tail
                        rows.splice(futureRows.length, tailSize);
                    }
                    
                    //}
                    
                    return rows;
                });
            })();
            
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
                    const $selected = $cont.find(':radio:checked').parent(),
                        pageYScrollPos = $(document).scrollTop() // page scroll's pos;
                    
                    if (! $selected[0]) {
                        scroll(exchangeRates, event);
                        return;
                    }
                    const selectedPosition = $selected.offset().top + $cont.scrollTop();
                    
                    $cont.stop().animate({
                        scrollTop: selectedPosition - .38 * $cont.height() - pageYScrollPos
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
                        //console.log('offsetYDelta', offsetYDelta);
                            $aside.scrollTop($aside.scrollTop() + offsetYDelta);
                        }
                    });
                });
                return pairs;
            },
            pairs = _.extend(ko.observableArray(), { reload });
        
        setInterval(reload, PAIRS_RENEW_INTERVAL);
        
        return reload(pairs);
    })(),
    
    CURRENCIES_FROM = ko.computed(() => pairsToCurrenciesFrom(PAIRS()), this, { deferEvaluation: true }),
    
    CURRENCIES_TO = ko.computed(() => pairsToCurrenciesTo(PAIRS()), this, { deferEvaluation: true }),
    
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
        $.getJSON('/cached/' + from + '/' + to + '.json')
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
            })
            .catch(e => {
                console.warn('wow, error', e);
                exchangeRates.rates([]);
            })
            .always(() => {
                exchangeRates.loading(false);
                more();
                
                _.isFunction(done) && done();
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
    
    // debug me
    exchangeRates.rates.subscribe(a => {
        //console.log('exchangeRates.rates([', a.length, '])');
        if (! a.length)
            console.warn('exchangeRates.rates([ 0 ]) happens');
    });
    
    request(() => {
        ko.applyBindings(exchangeRates, document.head);
        ko.applyBindings(exchangeRates, document.body);
        
        exchangeRates.page.pageInited = true;
    });
});
