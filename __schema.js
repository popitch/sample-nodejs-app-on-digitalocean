DB_SCHEMA = {
    "Exchanger": {
        "bcId": {
            "sample": 743,
            "type": "Natural",
            "index": {
                "primary": true
            }
        },
        "name": {
            "sample": "Treddr",
            "type": "String"
        },
        "location": {
            "sample": "AMS",
            "type": "String"
        },
        "flags": {
            "type": "Set",
            "sample": [
                "manual"
            ]
        },
        "xml": {
            "type": "URL"
        },
        "xmlVerified": {
            "type": "Boolean",
        }
    },
    
    "ExchangeRate": {
        "changer": {
            "type": "String",
            "sample": "Treddr",
        },
        "from": {
            "type": "String",
            "sample": "BTC",
        },
        "to": {
            "type": "String",
            "sample": "BTC",
        },
        "in": {
            "type": "Float",
            "sample": "1",
        },
        "out": {
            "type": "Float",
            "sample": "3263500",
        },
        "amount": "14970337.3711",
        "minamount": {
            "type": "String",
            "sample": "0.015 BTC",
        },
        "maxamount": {
            "type": "String",
            "sample": "1 BTC",
        },
        "param": {
            "type": "String",
            "sample": ["manual"],
        },
        "rateUrlTemplate": {
            "type": "String",
            "sample": "https://treddr.org/exchange-${fromSymbol}_to_${toSymbol}/(?rid=${partnerId})",
        }
    },
    
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
};
