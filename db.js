const { Sequelize/*, DataTypes*/ } = require('sequelize');

// setup postgres
require('pg').types.setTypeParser(1114, stringValue => {
    return new Date(stringValue + '+0000');
    // e.g., UTC offset. Use any offset that you would like.
});

const 
    dbConnString = process.env.DATABASE_URL + "&ssl=true",
    dbConnURL = new URL(dbConnString),
    
    DB_CERTIFICATE = process.env[ "DB_CERTIFICATE" ],
    
    sequelize = new Sequelize(
        dbConnURL.pathname.substr(1), // database, "/defaultdb" => "defaultdb" ;^]
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
                    ca: DB_CERTIFICATE,
                },
            }
        }
    );
//console.log('connOpts', JSON.stringify(connOpts, null, 4));


// connect
const
    connReady = sequelize.authenticate()
        .catch(console.warn.bind(console, 'DB...', 'Unable to connect to the db', process.env.DATABASE_URL))
        .then(console.log.bind(console, 'DB...', 'Connection has been established successfully.')),
    connThen = then => connReady.then(() => then(sequelize));


// create tables (aka db setup)
connThen(async (db) => {
    const schema = require('./db.schema');
    //console.log('db.schema', schema);
    
    const queryInterface = db.getQueryInterface();
    
    await queryInterface.dropTable('Exchanger');    
    await queryInterface.createTable('Exchanger', schema.Exchanger.fields);
    
    await queryInterface.dropTable('ExchangeRate');    
    await queryInterface.createTable('ExchangerRate', schema.ExchangeRate.fields);
});


// exports
module.exports = {
    then: then => connThen(then),
};
