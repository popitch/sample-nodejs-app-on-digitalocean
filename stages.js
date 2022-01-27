const now = () => +new Date;

// stage logs producer
module.exports = () => {
    const ms = { all: null }, starts = { all: now() };
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
            return JSON.stringify(this)
                .replace(/"/g, '')
                .replace(/[,\{:]/g, '$1 ')
                .replace(/\}/g, ' }');
        }
    };
};
