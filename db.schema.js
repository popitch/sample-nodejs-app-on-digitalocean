const { DataTypes } = require('sequelize');

module.exports = {
    "Exchanger": {
        indexes: [
            //{ unique: true, fields: ['id'], },
            { unique: true, fields: ['bcId'], },
            { unique: true, fields: ['name'], },
        ],
        fields: {
            id: {
                type: DataTypes.INTEGER,
                //defaultValue: null,
                //allowNull: true,
                primaryKey: true,
                autoIncrement: true,
            },
            
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: null,
                allowNull: true,
            },
            
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: null,
                allowNull: true,
            },
            
            bcId: {
                type: DataTypes.INTEGER,
                defaultValue: null,
                allowNull: true,
            },
            
            name: {
                type: DataTypes.STRING(32),
                defaultValue: null,
                allowNull: false,
            },
            fullname: {
                type: DataTypes.STRING(64),
                defaultValue: null,
                allowNull: true,
            },
            param: {
                type: DataTypes.JSON,
                defaultValue: '{}',
                allowNull: false,
            },
            
            // exchanger's pair (direction of exchange) URL template
            exUrlTmpl: {
                type: DataTypes.STRING,
                defaultValue: null,
                allowNull: true,
            },
            
            // xml
            xml: {
                type: DataTypes.STRING,
                defaultValue: null,
                allowNull: true,
            },
            xmlVerified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            
            xmlStartedAt: {
                type: DataTypes.BIGINT,
                defaultValue: null,
                allowNull: true,
            },
            xmlStage: {
                type: DataTypes.JSON,
                defaultValue: '{}',
                allowNull: false,
            },
            xmlParsedAt: {
                type: DataTypes.BIGINT,
                defaultValue: null,
                allowNull: true,
            },
        }
    },
    
    "ExchangeRate": {
        indexes: [
            { unique: true, fields: ['exchangerId', 'from', 'to'] },
        ],
        fields: {
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                autoIncrement: true,
            },

            createdAt: {
                type: DataTypes.DATE,
                defaultValue: null,
                allowNull: true,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: null,
                allowNull: true,
            },

            exchangerId: {
                type: DataTypes.INTEGER,
                defaultValue: null,
                allowNull: true,
            },
            from: {
                type: DataTypes.STRING(16),
                defaultValue: null,
                allowNull: true,
            },
            to: {
                type: DataTypes.STRING(16),
                defaultValue: null,
                allowNull: true,
            },
            in: {
                type: DataTypes.STRING(32),
                defaultValue: null,
                allowNull: true,
            },
            out: {
                type: DataTypes.STRING(32),
                defaultValue: null,
                allowNull: true,
            },
            amount: {
                type: DataTypes.STRING(32),
                defaultValue: null,
                allowNull: true,
            },
            minamount: {
                type: DataTypes.STRING(32),
                defaultValue: null,
                allowNull: true,
            },
            maxamount: {
                type: DataTypes.STRING(32),
                defaultValue: null,
                allowNull: true,
            },
            param: {
                type: DataTypes.JSON,
                defaultValue: '{}',
                allowNull: false,
            },
            minfee: {
                type: DataTypes.STRING(32),
                defaultValue: null,
                allowNull: true,
            },
            fromfee: {
                type: DataTypes.STRING(32),
                defaultValue: null,
                allowNull: true,
            },
            tofee: {
                type: DataTypes.STRING(32),
                defaultValue: null,
                allowNull: true,
            },
            city: {
                type: DataTypes.STRING(16),
                defaultValue: null,
                allowNull: true,
            },
        }
    },
    /*
    setField: (table, field, opts) => {
        table = DB_SCHEMA[table] = DB_SCHEMA[table] || {};
        
        let fields = field === '*' ? Object.keys(table) : field.split(',');
        
        fields.map(field => {
            if (typeof table[field] !== 'object') {
                table[field] = {
                    sample: table[field]
                };
            }
            Object.assign(table[field] = table[field] || {}, opts);
        });
    },
    
    export: () => {
        console.log(JSON.stringify(DB_SCHEMA, null, 4));
    }
    */
};
