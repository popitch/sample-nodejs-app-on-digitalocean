//js

function setButtonVisibility() {
    const current = $('input, textarea').get()
        .reduce((values, input) => {
            values[input.name] = $(input).is(':checkbox') ? !!$(input).is(':checked') : $(input).val();
            return values;
        }, {}),
        isIdent = _.all(_.keys('current'), key => !current[key] && !exch[key] || current[key] === exch[key]);
    
    console.log('isIdent:', isIdent, ', current:', current, ', exch:', exch);
    
    $('button').toggle(! isIdent);
}
