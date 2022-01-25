const { Sequelize, DataTypes } = require('sequelize');

const 
    dbConnString = process.env.DATABASE_URL + "&ssl=true",
    dbConnURL = new URL(dbConnString),
    
    DB_CERTIFICATE = process.env[ "DB_CERTIFICATE" ],
    
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
                    ca: DB_CERTIFICATE
                },
            }
        }
    );

console.log('connOpts', JSON.stringify(connOpts, null, 4));


// connect
let ready = new Promise;
sequelize.authenticate()
    .catch(console.warn.bind(console, 'DB...', 'Unable to connect to the db', process.env.DATABASE_URL))
    .then((arg) => {
        console.log('DB...', 'Connection has been established successfully.');
        
        ready.resolve(sequelize);
    })

// exports
module.exports = {
    //sequelize: sequelize,
    ready: ready
};
