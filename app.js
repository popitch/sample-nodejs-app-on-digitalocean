//const xmlTractor = 
require('./xml-engine');


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


// /
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// /login.html
app.use('/login.html', express.static(path.join(__dirname, 'public/login.html')));

app.post('/login', (req, res) => {
    // Insert Login Code Here
    let login = req.body.username;
    let password = req.body.password;
    res.send(`Username: ${login} Password: ${password}`);
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
