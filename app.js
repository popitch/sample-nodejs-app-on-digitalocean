//const xmlTractor = 
require('./xml-engine');

const PASSWD_HASH_FN = (passwd) => require('md5')(process.env.PASSWD_SIL + passwd);

var express = require('express');
var path = require('path');
//var logger = require('morgan');
const app = express(),
    _ = require('lodash');

// setup common
app.locals.basedir = __dirname; //path.join(__dirname, 'views');

// setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


require('lodash').extend(app.locals,
    require('./helpers/FormatString')
);

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
app.get('/login', (req, res) => res.render('login', { title: 'Вход' }));

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
        console.log('Error ::', e);
        return res.render('login', { title: e });
    }
    
    console.log('Login: complete');
    //res.redirect(307, '/admin/index');
    res.render('welcome', { user: req.session.user });
});

// GET /logout
app.get('/logout', async (req, res) => {
    req.session.user = null;
    //res.redirect('/');
    res.render('logout');
});

// GET /welcome (whois)
app.get('/welcome', (req, res) => res.render('welcome', { user: req.session.user }));


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
        title: 'Всего',
        exchList: exchList,
    });
});

// GET /admin/table/exchangers/<id>/edit
app.get('/admin/table/exchangers/:id/edit', 'admin.exchanger.edit', async (req, res) => {
    console.log('admin.exchanger.edit', req);
    
    const { db } = require('./db'),
        exchList = await db.models.Exchanger.findOne({ where: { id: req.id } });
    
    res.render('admin/table/exchangers', {
        title: 'Всего',
        exchList: exchList,
    });
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
