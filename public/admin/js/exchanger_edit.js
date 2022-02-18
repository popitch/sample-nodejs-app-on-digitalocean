//js

function setButtonVisibility() {
    const current = $('input, textarea').get()
        .reduce((values, input) => {
            values[input.name] = $(input).is(':checkbox') ? !!$(input).is(':checked') : $(input).val();
            return values;
        }, {}),
        isIdent = _.isEqual(_.pick(exch, _.keys('current')), current);
    
    console.log('isIdent:', isIdent, ', current:', current, ', exch:', exch);
    
    $('button').toggle(! isIdent);
}
