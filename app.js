var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');



// init sniffer
//const changerz = require('./xx/changerz');
//changerz.init(0);
const changers = ((initial) => {
	console.log('Setup with', initial.length, 'changers, where with verified xml source:', initial.filter(c => c.xml && c.xmlVerified).length);
	
	return initial;
})(
	JSON.parse(process.env[ "DB_CHANGERS" ])
);


// use postgres db
const 
    dbConnString = process.env.DATABASE_URL + "&ssl=true",
    dbConnURL = new URL(dbConnString),
    
    dbConnCert = process.env[ "DB_CERTIFICATE" ], // require('fs').readFileSync(__dirname + '/ca-certificate.crt').toString(),
    //dbConnCertBase64 = dbConnCert
    //    .replace(/^-*BEGIN CERTIFICATE-*\s*(.*)\s*-*END CERTIFICATE-*\s*$/, '$1'),
    
    Sequelize = require('sequelize'),
    sequelize = new Sequelize(
        dbConnURL.pathname.substr(1), // database, "/defaultdb" => "defaultdb" ;)
        dbConnURL.username,
        dbConnURL.password,
        connOpts = {
            connectionString: dbConnString,
        
            host: dbConnURL.hostname,
            port: dbConnURL.port,
            
            dialect: 'postgres',
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                    ca: dbConnCert,
                    //caBase64Decoded: new Buffer(dbConnCert, 'base64').toString('ascii'),
                },
            },
            /*
            ssl: {
                require: true,
                rejectUnauthorized: false,
                ca: dbConnCert,
                //caBase64Decoded: new Buffer(dbConnCert, 'base64').toString('ascii'),
            },
            */
        }
    );

console.log('connOpts', JSON.stringify(connOpts, null, 4));


// test db connection
try {
    console.log('Connect to db...', process.env.DATABASE_URL);
    /*await*/ 
    sequelize.authenticate()
        .catch(console.error.bind(console, 'Unable to connect to the database.'))
        .then(() => {
        	console.log('Connection has been established successfully.');
        	
        	// test conn
        	
        });
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
