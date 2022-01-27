const now = () => +new Date,
    _ = require('lodash');

// stage logs producer
module.exports = () => {
    let starts, curr,
        spaces = []; // has no reset
    
    const stages = {
        reset: (options) => {
            starts = { all: now() };
            stages.ms = { all: null };
            if (options && options.spaces) spaces = options.spaces;
            return stages;
        },
        
        begin: (stage, data) => {
            /*/ stage as value catcher
            if (/\d+.*\w+/i.exec(stage)) error(stage);
            
            // circus catcher
            try { JSON.stringify(stage) && JSON.stringify(data) }
            catch(e) { error(e) }
            //*/
            curr && stages.end(curr);
            stages.ms[curr = stage] = null;
            starts[curr] = now();
            if (data) stages[curr] = data;
        },
        
        end: (stage, data) => {
            stages.ms[stage] = now() - starts[stage];
            delete starts[stage];
            
            if (data) stages[curr] = 
                typeof data === 'object' ? _.extend(stages[curr] || {}, data) : data;
            curr = null;
            return now();
        },
        
        short: function() {
            // adaptive space cats
            let cat = 0;
                    
            //console.log(spaces);
            
            return JSON.stringify(this)
                // quotes
                .replace(/"/g, '')
                
                // spaces
                .replace(/(,|\{|:)/g, '$1 ')
                .replace(/\}/g, ' }')
                
                // equalize space indents for numbers
                .replace(/ (\d+)(,| )/g, (found, number, broker) => {
                    spaces[cat] = Math.max((spaces[cat] || 0) - .0625, number.length + .375);
                    
                    return ' ' + Array(
                        Math.round(spaces[cat++] - number.length)
                    ).fill(' ').join('') + number + broker;
                });
        }
    };
    
    return stages.reset();
};
