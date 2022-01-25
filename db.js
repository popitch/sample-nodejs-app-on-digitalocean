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


// connect
let connectedSeq;



// exports
module.exports = {
    auth: async () => {
        console.log('Connect to db...', process.env.DATABASE_URL);
        
        return connectedSeq = connectedSeq || await sequelize.authenticate()
            .catch(console.warn.bind(console, 'Connect to db...', 'Unable to connect to the db'))
            .then(() => {
                console.log('Connect to db...', 'Connection has been established successfully.');
                
                // test conn
                
            });
    }
};
