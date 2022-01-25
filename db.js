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


// connected
let connectedSeq;


// exports
module.exports = {
    //sequelize: sequelize,
    connect: async (then, fail) => {
        return (connectedSeq = connectedSeq || sequelize.authenticate()
            .catch(console.warn.bind(console, 'DB...', 'Unable to connect to the db', process.env.DATABASE_URL))
            .then((arg) => {
                console.log('DB...', 'Connection has been established successfully.', arg);
                
                // test conn
                //return sequelize;
            })
        )
        .then(then)
        .catch(fail);
    }
};
