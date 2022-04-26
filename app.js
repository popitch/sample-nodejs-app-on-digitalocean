// config
const PASSWD_HASH_FN = (passwd) => require('md5')(process.env.PASSWD_SIL + passwd);

// xmlTractor
const xmlEngine = require('./xml-engine'),
    rateUtils = require('./public/js/rate-utils.js');

/** app
 */
const express = require('express'),
    app = express(),
    path = require('path'),
    _ = require('lodash');


/** setup app engines
 */
const router = new (require('named-routes'));
router.extendExpress(app);
router.registerAppHelpers(app);

// setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// setup cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// setup session
const session = require('express-session');
app.use(
    session({
        secret: "Biggest secretly secret", // i use github, baby
        httpOnly: true,  // Don't let browser javascript access cookies. wow!
        secure: true, // Only use cookies over https. wow! ok
    })
);

// app.locals (wat?)
_.extend(app.locals, _.extend({
    basedir: __dirname,
},
    require('./helpers/FormatString')
));


/** views .locals
 */
app.use((req, res, next) => {
    if (! res.locals.session) {
        // session
        res.locals.session = req.session;
        
        // aggregator server status
        res.locals.aggregator = xmlEngine.aggregator;
        
        // moment.js
        res.locals.moment = require('moment');
        //import 'moment/locale/ru';  // without this line it didn't work
        res.locals.moment.locale('ru');
        
        // currencies consts
        _.extend(res.locals, rateUtils);
        _.extend(res.locals, {
            getCountTree: () => xmlEngine.getCountTree(),
            getExchangerById: id => xmlEngine.getExchangerById(id),
        });
    }
    next();
});


/** setup page routes
 */

// GET /
app.get('/', (req, res) => {
    const FROM = "BTC", TO = "P24UAH"; // defaults
    
    res.render('index', {
        title: 'Мониторинг обменников',
        exchange: {
            form: { from: FROM, to: TO },
            ratesPage: xmlEngine.getRatesByFT(FROM, TO),
        },
        formQueryString: 'from=' + FROM + '&to=' + TO,
    });
});

// GET /fag
app.get('/faq', (req, res) => res.render('faq'));

// GET ~ /btc-to-xvg#↓amount
app.get('/*-to-*', (req, res, next) => {
    const countTree = xmlEngine.getCountTree(),
        pair = req.path.substr(1).split('-to-', 2);
    
    console.log("Try to GET pair:", pair, '...');
    
    function findKeyByLowerCase(hash, lokey) {
        for (var KEY in hash) {
            if (KEY.toLowerCase() === lokey) {
                return KEY;
            }
        }
    }
    
    const FROM = findKeyByLowerCase(countTree, pair[0]);
    if (! FROM) {
        console.log('not found from=', FROM);
        next();
    }
    console.log("Try to GET pair:", pair, '... from =', FROM);
    
    const TO = findKeyByLowerCase(countTree[FROM], pair[1]);
    if (! TO) {
        console.log('not found to=', TO);
        next();
    }
    console.log("Try to GET pair:", pair, '... go to =', TO);
    
    const pageSize = countTree[FROM][TO];
    
    console.log("Try to GET pair:", pair, '... rates count =', pageSize);
    
    
    res.render('pair', {
        title: _.template('Обмен ${from} на ${to}')({
            from: rateUtils.CURRENCY_NAME_BY_SYMBOL[FROM] || FROM,
            to: rateUtils.CURRENCY_NAME_BY_SYMBOL[TO] || TO,
        }),
        exchange: {
            form: {
                from: FROM,
                to: TO,
            },
            ratesPage: xmlEngine.getRatesByFT(FROM, TO),
        },
        formQueryString: 'from=' + FROM + '&to=' + TO,
    });
});

// GET /login
app.get('/login', (req, res) => {
    res.render('login', {
        title: 'Вход',
    });
});

// POST /login
app.post('/login', async (req, res) => {
    console.log('Login...');
    
    if (! req.body.login || ! req.body.password) {
        console.log('Login: without login or password');
        res.status("400");
        return res.render('login', { title: 'Введите оба параметра, логин и пароль' });
    }
    
    try {
        const { db } = require('./db');
        
        /*/ setup) root passw..
        const affp = await db.models.AggUser.bulkCreate([{
            login: 'root',
            passwd: PASSWD_HASH_FN(process.env.PASSWD_ROOT),
        }], {
            validate: true,
            updateOnDuplicate: ['passwd'],
        });
        console.log(affp.length, 'affected passwd(s) with passwd', PASSWD_HASH_FN(process.env.PASSWD_ROOT));
        //*/
        
        // try to find user
        const passwd = PASSWD_HASH_FN(req.body.password);
        //console.log('Login: login=', req.body.login, 'passwd=', passwd, 'pw=', req.body.password);
        
        const user = await db.models.AggUser.findOne({ where: { login: req.body.login, passwd: passwd } });
        
        // save founds to session
        req.session.user = user;
        
        console.log('Login: found user', user && user.login);
        
        if (! user) {
            return res.render('login', { title: 'Пользователь с таким паролём не найден' });//No user found with login+password' });
        }
    } catch(e) {
        console.log('Login: ERROR:', e);
        return res.render('login', { title: e });
    }
    
    const loggedUser = req.session.user;
    
    console.log('Login: complete, with', loggedUser.login);
    
    res.render('welcome', { user: loggedUser, isRoot: 'root' === loggedUser.login });
});

// GET /logout
app.get('/logout', async (req, res) => {
    req.session.user = null;
    //res.redirect('/');
    res.render('logout');
});

// GET /welcome (whois)
app.get('/welcome', (req, res) => {
    res.render('welcome', {
        user: req.session.user,
        isRoot: 'root' === req.session.user.login,
    });
});


 // admin area rule
//
app.all('/admin/**', (req, res, next) => {
    const isRoot = (req.session.user && req.session.user.login === 'root'),
        isLoggedIn = !! req.session.user;
    
    console.log('isRoot: ', isRoot);
    console.log('isLoggedIn: ', isLoggedIn);
    
    if (isLoggedIn) {
        next();
    } else {
        res.redirect(302, '/login');
    }
});


// GET /admin/index
app.get('/admin/index', async (req, res) => {
    if ('root' !== req.session.user.login) {
        return res.redirect(302, '/login');
    }
    
    res.render('welcome', {
        user: req.session.user,
        isRoot: 'root' === req.session.user.login,
});
});


// GET /admin/table/users
app.get('/admin/table/users', 'admin.users', async (req, res) => {
    if ('root' !== req.session.user.login) {
        console.warn('! Admin: access denied to not root edit other, from', req.session.user.login);
        return res.redirect(302, '/login');
    }
    
    const AggUser = require('./db').db.models.AggUser,
        userList = _.sortBy(await AggUser.findAll(), [ 'login' ]);
    
    res.render('admin/table/users', {
        title: 'Пользователи',
        list: userList.map(user => {
            user.emptyPasswd = (PASSWD_HASH_FN('') === user.passwd);
            return user;
        }),
    });
});

// GET /admin/table/users/<login> (edit)
app.get('/admin/table/users/:login', 'admin.user_edit', async (req, res) => {
    if ('root' !== req.session.user.login && req.params.login != req.session.user.login) {
        console.warn('! Admin: access denied to not root edit other, from', req.session.user.login);
        return res.redirect(302, '/login');
    }
    
    const AggUser = require('./db').db.models.AggUser,
        isNew = 'new' === req.params.login,
        user = isNew ? new AggUser : await AggUser.findOne({ where: { login: req.params.login } });
    
    if (! user) {
        return res.send("Unknown user requested with login: " + req.params.login);
    }
    
    const exchangerList = await getSortedExchangerList();
    
    res.render('admin/table/user_edit', {
        title: (user.login || '<Новый>') + ' - Пользователи',
        user: user,
        isNew,
        canEditExchanger: 'root' === req.session.user.login,
        exchangerList: exchangerList,
        userExchanger: _.find(exchangerList, exch => exch.id == user.exchangerId),
    });
});

// POST /admin/table/users/<login> (update)
app.post('/admin/table/users/:login', async (req, res) => {
    if ('new' === req.body.login) {
        return res.send('Impossible name: new');
    }
    
    if ('root' !== req.session.user.login && 'root' === req.params.login) {
        console.warn('! Admin: not root trying to change root... user:', req.session.user);
        return res.send(403, 'Access denied');
    }
    
    // only root can change user.exchangerId
    if ('root' !== req.session.user.login && req.body.exchangerId) {
        return res.send(403, 'Access denied');
    }
    
    const { db } = require('./db'),
        { DataTypes } = require('sequelize');
        
        AggUser = db.models.AggUser,
        isNew = 'new' === req.params.login,
        user = isNew ? new AggUser : await AggUser.findOne({ where: { login: req.params.login } });
    
    if (! user) {
        return res.send("Unknown user requested, login: " + req.params.login);
    }
    
    try {
        const ATTRS = AggUser.getAttributes(),
            UPDATE_KEYS = _.difference(_.keys(ATTRS), ['id', 'passwd']);
        
        _.forEach(UPDATE_KEYS, (key) => {
            let changed = false;
            if (DataTypes.BOOLEAN === ATTRS[key].type) {
                user[key] = !! req.body[key];
                changed = true;
            }
            else if (_.has(req.body, key)) {
                user[key] = req.body[key];
                changed = true;
            }
            console.log('.. user[', key, '] = ', user[key], changed ? '' : ' (no change)');
        });
        
        // passwd
        if (req.body.passwd && user.passwd !== PASSWD_HASH_FN(req.body.passwd)) {
            user.passwd = PASSWD_HASH_FN(req.body.passwd);
            console.log('.. user[passwd] = ', user.passwd);
            UPDATE_KEYS.push('passwd');
        }
        
        console.log('save user ...', user.id);
        const saveResult = await user.save({ fields: UPDATE_KEYS });
        console.log('... save user', saveResult);
        
        res.redirect(302, router.build('admin.user_edit', { login: user.login }));
    } catch(e) {
        console.log('Admin: error occurs while to save USER:', e, 'with request.body', req.body, 'with user', user);
        res.send(e.message);
    }
});




// GET /admin/table/exchangers
app.get('/admin/table/exchangers', 'admin.exchangers', async (req, res) => {
    if ('root' !== req.session.user.login) {
        return res.send(403, 'Access denied');
    }
    
    res.render('admin/table/exchangers', {
        title: 'Обменники',
        exchList: await getSortedExchangerList(),
        ratesByExchangerId: xmlEngine.ratesByExchangerId(),
    });
});

// GET /admin/table/exchangers/<id> (edit)
app.get('/admin/table/exchangers/:id', 'admin.exchanger_edit', async (req, res) => {
    if ('root' !== req.session.user.login && req.params.id != req.session.user.exchangerId) {
        return res.send(403, 'Access denied');
    }
    
    const Exchanger = require('./db').db.models.Exchanger,
        isNew = 'new' === req.params.id,
        exch = isNew ? new Exchanger : await Exchanger.findOne({ where: { id: req.params.id } });
    
    if (! exch) {
        return res.send("Unknown exchanger requested with id: " + req.params.id);
    }
    
    res.render('admin/table/exchanger_edit', {
        title: (exch.name || '<Новый>') + ' - Обменники',
        exch: exch,
        ratesCount: ( xmlEngine.ratesByExchangerId()[ req.params.id ] || [] ).length,
        isNew
    });
});

// POST /admin/table/exchangers/<id> (update)
app.post('/admin/table/exchangers/:id', async (req, res) => {
    if ('root' !== req.session.user.login && req.params.id != req.session.user.exchangerId) {
        return res.send(403, 'Access denied');
    }
    
    const { db } = require('./db'),
        { DataTypes } = require('sequelize');
        
        Exchanger = db.models.Exchanger,
        isNew = 'new' === req.params.id,
        exch = isNew ? new Exchanger : await Exchanger.findOne({ where: { id: req.params.id } });
    
    if (! exch) {
        return res.send("Unknown exchanger requested, id: " + req.params.id);
    }
    
    try {
        const ATTRS = Exchanger.getAttributes(),
            UPDATE_KEYS = _.difference(_.keys(ATTRS), ['id']);
        
        _.forEach(UPDATE_KEYS, (key) => {
        //_.forEach(['name', 'fullname', 'description', 'ru', 'en', 'xml', 'exUrlTmpl'], (key) => {
            let changed = false;
            if (DataTypes.BOOLEAN === ATTRS[key].type) {
                exch[key] = !! req.body[key];
                changed = true;
            }
            else if (_.has(req.body, key)) {
                exch[key] = req.body[key];
                changed = true;
            }
            console.log('.. exch[', key, '] = ', exch[key], changed ? '' : ' (no change)');
        });
        
        console.log('save exch ...', exch.id);
        const saveResult = await exch.save({ fields: UPDATE_KEYS });
        console.log('... save exch', saveResult);
        
        res.redirect(302, router.build('admin.exchanger_edit', { id: exch.id || req.params.id }));
    } catch(e) {
        console.log('Admin: error occurs while to save exchanger:', e, 'with request.body', req.body, 'with exch', exch);
        res.send(e.message);
    }
});




// /table.html
app.use('/table.html', express.static(path.join(__dirname, 'public/table.html')));

// any http: static
app.use(express.static(path.join(__dirname, 'public')));

// static for /cached/*.json
app.use('/cached', express.static(path.join(__dirname, 'public/cached')));

// catch 404 and forward to error handler
var createError = require('http-errors');
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






// common data accessors
async function getSortedExchangerList() {
    const Exchanger = require('./db').db.models.Exchanger;
    
    return _.chain(await Exchanger.findAll())
        .map(ex => {
            // js-shn dates
            ['createdAt', 'updatedAt', 'xmlParsedAt', 'xmlStartedAt'].forEach(dateKey => {
                ex[dateKey] = ex[dateKey] && new Date(Number(ex[dateKey]));
            });
            return ex;
        })
        .sortBy([ ex => ex.xmlStartedAt || ex.xmlParsedAt || ex.updatedAt || ex.createdAt, 'xmlVerified', 'xml', 'name' ])
        .value()
        .reverse();
}
