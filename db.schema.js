module.export = {
    "Exchanger": {
        indexes: [
            { unique: true, fields: ['id'], },
        ],
        fields: {
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                autoIncrement: true,
            },
            
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
                type: DataTypes.BIGINT,
                defaultValue: null,
                allowNull: true,
            },
            xmlStartedAt: {
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
            updatedAt: {
                type: DataTypes.BIGINT,
                defaultValue: null,
                allowNull: true,
            },
            exchangerId: {
                type: DataTypes.INTEGER,
                defaultValue: null,
                allowNull: false,
            },
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
