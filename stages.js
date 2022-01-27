const now = () => +new Date;

// stage logs producer
module.exports = () => {
    const starts = { all: now() },
        ms = { all: null },
        spaces = [];
    
    let stages, curr;
    
    return stages = {
        ms: ms,
        
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
                    spaces[cat] = Math.max((spaces[cat] || 0) - .1, number.length + .4);
                    
                    console.log(spaces[cat], 'for', number);
                    
                    return ' ' + number + Array(
                        Math.floor(spaces[cat++] - number.length)
                    ).fill(' ').join('') + broker;
                });
        }
    };
};
