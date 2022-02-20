// run xmlTractor = 
const xmlRoratorEngine = require('./xml-engine');

// app
const express = require('express'),
    app = express();

// setup common things
const path = require('path'),
    _ = require('lodash');

const PASSWD_HASH_FN = (passwd) => require('md5')(process.env.PASSWD_SIL + passwd);
app.locals.basedir = __dirname; //path.join(__dirname, 'views');

// setup routes engine
const router = new (require('named-routes'));
router.extendExpress(app);
router.registerAppHelpers(app);

// setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


const FormatString = require('./helpers/FormatString');
require('lodash').extend(app.locals, FormatString);

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// setup session
const session = require('express-session');
app.use(
    session({
        secret: "Biggest secretly secret", // i use github, baby
        httpOnly: true,  // Don't let browser javascript access cookies. wow!
        secure: true, // Only use cookies over https. wow! ok
    })
);
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(session({ secret: "Your secret key will here" }));

// setup page routes //

// GET /
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// GET /login
app.get('/login', (req, res) => {
    res.render('login', {
        title: 'Вход'
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
        const affp = await db.models.AggUser.bulkCreate([{ login: 'root', passwd: PASSWD_HASH_FN(process.env.PASSWD_ROOT) }], {
            validate: true, updateOnDuplicate: ['login', 'passwd']
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
    
    res.render('welcome', { user: loggedUser });
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
    const isRoot = (req.session.user && req.session.user.login === 'root');
    
    console.log('checkIsRoot: ', isRoot);
    if (isRoot) {
        next();
    } else {
        res.redirect(302, '/login');
    }
});

// GET /admin/table/exchangers
app.get('/admin/table/exchangers', async (req, res) => {
    const { db } = require('./db'),
        exchList = _.sortBy(await db.models.Exchanger.findAll(), [ ex => ex.xmlStartedAt || ex.xmlParsedAt || ex.updatedAt, 'xmlVerified', 'xml', 'name' ]).reverse();
    
    res.render('admin/table/exchangers', {
        title: 'Обменники',
        exchList: exchList.map(ex => {
            ['createdAt', 'updatedAt', 'xmlParsedAt', 'xmlStartedAt'].forEach(dateKey => {
                ex[dateKey] = ex[dateKey] && new Date(Number(ex[dateKey]));
            });
            return ex;
        }),
        ratesByExchangerId: xmlRoratorEngine.ratesByExchangerId(),
    });
});

// GET /admin/table/exchangers/<id>/edit
app.get('/admin/table/exchangers/:id', 'admin.exchanger_edit', async (req, res) => {
    if ('root' !== req.session.user.login && req.params.id != req.session.user.id) {
        return res.send('Admin: not root && not owner cond from view/admin.exchanger_edit');
    }
    
    const exch = await require('./db').db.models.Exchanger.findOne({ where: { id: req.params.id } });
    
    res.render('admin/table/exchanger_edit', {
        title: exch.name,
        exch: exch,
        ratesByExchangerId: xmlRoratorEngine.ratesByExchangerId(),
    });
});

// POST /admin/table/exchangers/<id>/edit
app.post('/admin/table/exchangers/:id', async (req, res) => {
    const exch = await require('./db').db.models.Exchanger.findOne({ where: { id: req.body.id } });
    
    if (! exch) {
        return res.send("Unknown exchanger requested, id: " + req.body.id);
    }
    
    _.each(['fullname', 'description', 'ru', 'en', 'xml', 'xmlVerified'], key => {
        exch.setDataValue(key, req.body[key]);
    });
    exch.save();
    
    res.redirect(302, router.build('admin.exchanger_edit', { id: req.body.id }));
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
