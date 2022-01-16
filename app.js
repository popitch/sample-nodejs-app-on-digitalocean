var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');



// pre db, fixing O_o
// https://github.com/knex/knex/issues/852#issuecomment-229502678
var pg = require('pg');
pg.defaults.ssl = true;

// use postgres db
const 
    dbConnURL = new URL(process.env.DATABASE_URL),
    
    Sequelize = require('sequelize'),
    sequelize = new Sequelize(
        dbConnURL.pathname.substr(1), // database, "/defaultdb" => "defaultdb" ;)
        dbConnURL.username,
        dbConnURL.password,
        {
            //connectionString: process.env.DATABASE_URL,
        
            host: dbConnURL.hostname || process.env.DB_HOST || 'db-postgresql-ams3-69375-do-user-10580711-0.b.db.ondigitalocean.com' || 'localhost',
            port: dbConnURL.port || process.env.DB_PORT || 25060 || 5432,
            
            dialect: 'postgres',
            //dialectOptions: {
            //    ssl: process.env.DB_SSL == "true"
            //}
            
            ssl: {
                rejectUnauthorized: false,
            },
            /*
            
            11. Unable to connect to the database. ConnectionRefusedError [SequelizeConnectionRefusedError]: connect ECONNREFUSED 127.0.0.1:5432
            
            12. Unable to connect to the database. ConnectionError [SequelizeConnectionError]: no pg_hba.conf entry for host "174.138.104.209", user "doadmin", database "<sub>/defaultdb</sub>", SSL off
            
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
            */
        }
    );

console.log('dbConnURL', dbConnURL);

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
