const sequelizemo = require('sequelize');
const schema = require('./db.schema');
const _ = require('lodash');

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
    
    connThen = async (then) => connReady.then(() => then(sequelize).catch(e => console.log('Connection level Error handled:', e)));

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

sequelize.define('AggUser', schema.AggUser.fields, {
    indexes: schema.AggUser.indexes,
    timestamps: true, // Adds createdAt and updatedAt timestamps to the model.
    charset: 'UTF8',
    tableName: 'aggUsers',
    freezeTableName: true,
})
//.sync({ alter: true })
;

// create tables (aka db setup)
connThen(async (db) => {
    const queryInterface = db.getQueryInterface();
    
    
    
    await queryInterface.addColumn('aggUser', 'exchangerId', schema.AggUsers.fields.exchangerId);
    //*/
    
    /*/
    await queryInterface.addColumn('exchangers', 'ru', schema.Exchanger.fields.description);
    await queryInterface.addColumn('exchangers', 'en', schema.Exchanger.fields.description);
    //await queryInterface.addColumn('exchangers', 'description', schema.Exchanger.fields.description);
    //*/
    
    /*
    await queryInterface.dropTable('exchangers', { onDelete: 'cascade' });
    await queryInterface.createTable('exchangers', schema.Exchanger.fields);
    await queryInterface.addConstraint('exchangers', {
        fields: ['bcId'],
        type: 'unique',
        name: 'exchanger_bcId_unique_constraints',
    });
    await queryInterface.addConstraint('exchangers', {
        fields: ['name'],
        type: 'unique',
        name: 'exchanger_name_unique_constraints',
    });
    
    /*
    await queryInterface.dropTable('exchangeRates', { onDelete: 'cascade' });
    await queryInterface.createTable('exchangeRates', schema.ExchangeRate.fields);
    await queryInterface.addConstraint('exchangeRates', {
        fields: schema.ExchangeRate.indexes[0].fields,
        type: 'unique',
        name: 'exchanger_pair_unique_constraints',
    });
    await queryInterface.addIndex('exchangeRates', schema.ExchangeRate.indexes[0]);
    //*/
    
    console.log('Initial Exchangers:', await db.models.Exchanger.count({ logging: false }));
    console.log('Initial Rates:', await db.models.ExchangeRate.count({ logging: false }));
    
    return db;
}).catch(console.log);


// exports
module.exports = {
    then: then => connThen(then),
    db: sequelize,
};
