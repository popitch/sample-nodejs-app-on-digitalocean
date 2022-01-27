const now = () => +new Date,
    _ = require('lodash');

// stage logs producer
module.exports = () => {
    let starts, ms, spaces;
    let stages, curr;
    
    return stages = {
        ms: ms,
        
        start: () => {
            starts = { all: now() };
            ms = { all: null };
            spaces = [];
            return stages;
        },
        
        begin: (stage, data) => {
            
            // stage as value cather
            if (/\d+.*\w+/i.exec(stage)) error(stage);
            
            // circus catcher
            try { JSON.stringify(stage) && JSON.stringify(data) }
            catch(e) { error(e) }
            
            curr && stages.end(curr);
            ms[curr = stage] = null;
            starts[curr] = now();
            if (data) stages[curr] = data;
        },
        
        end: (stage, data) => {
            ms[stage] = now() - starts[stage];
            delete starts[stage];
            
            if (data) stages[curr] = 
                typeof data === 'object' ? _.extend(stages[curr] || {}, data) : data;
            curr = null;
            return now();
        },
        
        short: function() {
            // adaptive space cats
            let cat = 0;
            
            return JSON.stringify(this)
                // quotes
                .replace(/"/g, '')
                // spaces
                .replace(/(,|\{|:)/g, '$1 ')
                .replace(/\}/g, ' }')
                // equalize indents for numbers
                .replace(/ (\d+)(,| )/g, (found, number, broker) => {
                    const space = spaces[cat] = Math.max((spaces[cat] || 0) - .125, number.length + .625);
                    cat++;
                    
                    //console.log(spaces);
                    
                    return ' ' + number + Array(
                        Math.floor(space - number.length)
                    ).fill(' ').join('') + broker;
                });
        }
    };
};
