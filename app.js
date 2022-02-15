//const xmlTractor = 
require('./xml-engine');

const PASSWD_HASH_FN = (passwd) => require('md5')('asHkjh$%^&nvZD23' + passwd);

var express = require('express');
var path = require('path');
var logger = require('morgan');

const app = express();

// setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// setup session
const session = require('express-session');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(session({ secret: "Your secret key will here" }));

// setup page routes //
// /
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// /login.html
app.use('/login', (req, res) => res.render('login'));

function checkSignIn(req, res, next){
   if (req.session.user) {
      next && next();     //If session exists, proceed to page
      return true;
   }
   else {
      var err = new Error("Not logged in!");
      console.log(req.session.user, err);
      next(err);  //Error, trying to access unauthorized page!
   }
}

app.post('/login', async (req, res) => {
    console.log('login..');
    
    if (! req.body.login || ! req.body.password) {
        console.log('Login: without login or password');
        res.status("400");
        //res.render('login', { message: "Please enter both id and password" });
        return res.json('Please enter both id and password');
    }
    
    if (checkSignIn(req, res)) {
        console.log('Login: already logged in');
        //res.render('login', { message: "Already logged in" });
        return res.json('Already logged in');
    }
    
    try {
        const { db } = require('./db');
        
        /*/ setup) root passw..
        const affp = await db.models.AggUser
            .bulkCreate([{
                login: 'root',
                passwd: PASSWD_HASH_FN( process.env.ROOT_PASSWD ),
            }], {
                validate: true,
                updateOnDuplicate: ['login'],
                //logging: true,
            });
        console.log(affp.length, 'affected passwd(s)');
        //*/
        
        // try to find
        const user = await db.models.AggUser.findOne({
            where: {
                login: req.body.login,
                passwd: PASSWD_HASH_FN(req.body.password),
            },
        });
        
        // save founds to session
        req.session.user = user;
        
        console.log('with user', user && user.login);
        
        res.json(user ? 0 : 'Has no user found with login+password');
    } catch(e) {
        console.log('Error ::', e);
    }
    
    console.log('..login');
});

// /table.html
app.use('/table.html', express.static(path.join(__dirname, 'public/table.html')));


// any http: static
app.use(express.static(path.join(__dirname, 'public')));


// static for /cached/*.json
app.use('/cached', express.static(path.join(__dirname, 'public/cached')));

/*/ dynamic for exchange table
const tableRouter = require('./routes/table');
app.use('/table', tableRouter);
//*/

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

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
