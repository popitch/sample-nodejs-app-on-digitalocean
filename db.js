const sequelizemo = require('sequelize');
const schema = require('./db.schema');
const _ = require('lodash');

// setup postgres
require('pg').types.setTypeParser(1114, stringValue => {
    return new Date(stringValue + '+0000');
    // e.g., UTC offset. Use any offset that you would like.
});

// setup connection
const
    DB_CONNECTION_URI = process.env[ "DB_CONNECTION_URI" ],
    dbConnURL = new URL(DB_CONNECTION_URI),

    DB_CERTIFICATE = process.env[ "DB_CERTIFICATE" ],

    sequelize = new sequelizemo.Sequelize(
        dbConnURL.pathname.substr(1), // database, "/defaultdb" => "defaultdb" ;^]
        dbConnURL.username,
        dbConnURL.password,
        connOpts = {
            connectionString: DB_CONNECTION_URI,
            
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
        .catch((e) => console.warn('DB.. [catch] Unable to connect to the db', dbConnURL, 'with exception:', e))
        .then(
            (resolved) => console.log('DB.. [resolve] Connection has been established successfully. With result:', resolved),
            (rejected) => console.warn('DB.. [reject] Unable to connect to the db', dbConnURL, 'with rejection:', rejected)
        ),

    connThen = async (then) => connReady.then(async () => {
        return await then(sequelize)
            .catch(e => console.log('connThen() [catch] Connection level Error handled:', e));
    });

// define models
const Exchanger = sequelize.define('Exchanger', schema.Exchanger.fields, {
    indexes: schema.Exchanger.indexes,
    timestamps: true, // Adds createdAt and updatedAt timestamps to the model.
    charset: 'UTF8',
    initialAutoIncrement: 1e6,
    tableName: 'exchangers',
    freezeTableName: true,
})
    .sync()
    ;

sequelize.define('ExchangeRate', schema.ExchangeRate.fields, {
    indexes: schema.ExchangeRate.indexes,
    timestamps: true, // Adds createdAt and updatedAt timestamps to the model.
    charset: 'UTF8',
    tableName: 'exchangeRates',
    freezeTableName: true,
})
    .sync()
    ;

sequelize.define('AggUser', schema.AggUser.fields, {
    indexes: schema.AggUser.indexes,
    timestamps: true, // Adds createdAt and updatedAt timestamps to the model.
    charset: 'UTF8',
    tableName: 'aggUsers',
    freezeTableName: true,
})
    .sync()
    ;

// create tables (aka db setup)
connThen(async (db) => {
    const queryInterface = db.getQueryInterface();

    /** Setup initial exchanger list from ENV data
     */
    const Exchanger = sequelize.models.Exchanger,
        presentedExchangers = await Exchanger.findAll(),
        INITIAL_EXCHANGERS = JSON.parse( process.env[ "INITIAL_EXCHANGERS" ] );
    
    console.log('presentedExchangers:', presentedExchangers.length);
    console.log('INITIAL_EXCHANGERS:', INITIAL_EXCHANGERS.length);
    
    let createdCount = 0;
    _.each(INITIAL_EXCHANGERS, async (exchData) => {
        if (! _.find(presentedExchangers, exch => exch.id == exchData.id)) {
            exchData.bcId = exchData.id;
            exchData.xmlVerified = !! exchData.xml;
            await new Exchanger(exchData).save();
            
            createdCount++;
        }
    });
    console.log('Exchangers initial created count:', createdCount, '(thanks, bro)');
    
    /**
     */
    console.log('Initial Exchangers:', await db.models.Exchanger.count({ logging: false }));
    console.log('Initial Rates:', await db.models.ExchangeRate.count({ logging: false }));
    
    // warm up the cache
    console.time('Warm up rates cache...');
    setTimeout(async() => {
        const xmlEngine = require('./xml-engine');
        await xmlEngine.warmUpRatesCache();
        console.timeEnd('Warm up rates cache...');
    });
    
    //return db;
}).catch(console.log);


// exports
module.exports = {
    then: then => connThen(then),
    db: sequelize,
    /*setupData: {
        exchangers: JSON.parse(
            process.env["SETUP_EXCHANGERS"]
        ),
    }*/
};
