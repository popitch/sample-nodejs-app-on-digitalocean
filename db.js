const sequelizemo = require('sequelize');
const schema = require('./db.schema');

// setup postgres
//require('pg').types.setTypeParser(1114, stringValue => {
//    return new Date(stringValue + '+0000');
//    // e.g., UTC offset. Use any offset that you would like.
//});

// setup connection
const 
    dbConnString = process.env.DATABASE_URL + "&ssl=true",
    dbConnURL = new URL(dbConnString),
    
    DB_CERTIFICATE = process.env[ "DB_CERTIFICATE" ],
    
    sequelize = new sequelizemo.Sequelize(
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
                    rejectUnauthorized: true,
                    ca: DB_CERTIFICATE,
                },
            },
        }
    );
//console.log('connOpts', JSON.stringify(connOpts, null, 4));

// connect
const
    connReady = sequelize.authenticate()
        .catch(console.warn.bind(console, 'DB...', 'Unable to connect to the db', process.env.DATABASE_URL))
        .then(console.log.bind(console, 'DB...', 'Connection has been established successfully.')),
    connThen = then => connReady.then(() => then(sequelize));

// define models
sequelize.define('Exchanger', schema.Exchanger.fields, {
    indexes: schema.Exchanger.indexes,
    timestamps: true, // Adds createdAt and updatedAt timestamps to the model.
    charset: 'UTF8',
    initialAutoIncrement: 1e6,
    tableName: 'exchangers',
    freezeTableName: true,
});
sequelize.define('ExchangeRate', schema.ExchangeRate.fields, {
    indexes: schema.ExchangeRate.indexes,
    timestamps: true, // Adds createdAt and updatedAt timestamps to the model.
    //createdAt: true,
    //updatedAt: true,
    charset: 'UTF8',
    tableName: 'exchangeRates',
    freezeTableName: true,
});

// create tables (aka db setup)
connThen(async (db) => {
    const queryInterface = db.getQueryInterface();
    
    await queryInterface.dropTable('Exchanger');
    await queryInterface.dropTable('exchanger');
    await queryInterface.dropTable('exchangers');
    await queryInterface.createTable('exchangers', schema.Exchanger.fields);
    
    await queryInterface.dropTable('ExchangeRate');
    await queryInterface.dropTable('exchangeRate');
    await queryInterface.dropTable('exchangeRates');
    await queryInterface.createTable('exchangerRates', schema.ExchangeRate.fields);
});


// exports
module.exports = {
    then: then => connThen(then),
};
