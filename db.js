const { Sequelize, DataTypes } = require('sequelize');

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
                    ca: DB_CERTIFICATE
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


// postgres setup
require('pg').types.setTypeParser(1114, stringValue => {
    return new Date(stringValue + '+0000');
    // e.g., UTC offset. Use any offset that you would like.
});


// create tables (aka db setup)
connThen(async (db) => {
    //const { Sequelize, DataTypes } = require('sequelize');
    
    const queryInterface = db.getQueryInterface();
    
    await queryInterface.dropTable('Exchanger');    
    await queryInterface.createTable('Exchanger', {
        /* id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
        }, */
  
        bcId: {
            type: DataTypes.INTEGER,
            defaultValue: null,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: false,
        },
        param: {
            type: DataTypes.JSON,
            defaultValue: '{}',
            allowNull: false,
        },
        
        xml: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: true,
        },
        xmlVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        xmlStage: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: true,
        },
        xmlParsedAt: {
            type: DataTypes.INTEGER,
            defaultValue: null,
            allowNull: true,
        },
        xmlStartedAt: {
            type: DataTypes.INTEGER,
            defaultValue: null,
            allowNull: true,
        },
    });
    
    await queryInterface.dropTable('ExchangeRate');    
    await queryInterface.createTable('ExchangerRate', {
        from: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: true,
        },
        to: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: true,
        },
        in: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: true,
        },
        out: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: true,
        },
        amount: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: true,
        },
        minamount: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: true,
        },
        maxamount: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: true,
        },
        param: {
            type: DataTypes.JSON,
            defaultValue: '{}',
            allowNull: false,
        },
        minfee: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: true,
        },
        fromfee: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: true,
        },
        tofee: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: true,
        },
    });
});


// exports
module.exports = {
    then: then => connThen(then),
};
