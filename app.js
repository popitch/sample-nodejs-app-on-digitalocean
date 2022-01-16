var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');





// trying to use Postgres db
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    //host: process.env.DB_HOST || 'localhost',
    //port: process.env.DB_PORT || 5432,
    
    //dialect: 'postgres',
    //dialectOptions: {
    //    ssl: process.env.DB_SSL == "true"
    //}
    
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // <<<<<<< YOU NEED THIS
        }
    },
    ssl: {
        require: true,
        rejectUnauthorized: false,
        //ca: require('fs').readFileSync(__dirname + '/ca-certificate.crt'),
    }
});

// test db connection
try {
    console.log('Connect to db...', process.env.DATABASE_URL);
    /*await*/ 
    const dbConnPromise = sequelize.authenticate();
    dbConnPromise
        .then(console.log.bind(console, 'Connection has been established successfully.'))
        .catch(console.error.bind(console, 'Unable to connect to the database.'));
}
catch (error) {
    console.error('Unable to connect to the database:', error);
}




var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
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
