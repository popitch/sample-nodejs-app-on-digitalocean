//js

$(() => {
    $('input, textarea').on('change keyup', setButtonVisibility);
    setButtonVisibility();
});
/*
window.onbeforeunload = function(){
    console.log('Tab try to be closing...');
    return getIsIdently() ? '' : 'Пропадут изменения Пользователя на этой странице, ок?';
};
*/
function getIsIdently() {
    const current = $('input, textarea').get()
        .reduce((values, input) => {
            values[input.name] = $(input).is(':checkbox') ? !! $(input).is(':checked') : $(input).val();
            return values;
        }, {}),
        isIdent = _.all(_.keys(current), key => (! current[key] && ! user[key]) || current[key] == user[key]);
    
    console.log('isIdent:', isIdent, ', current:', current, ', user:', user);
    
    return isIdent;
}

function setButtonVisibility() {
    $('button')[0].style.visibility = getIsIdently() ? 'hidden' : 'visible';
}
