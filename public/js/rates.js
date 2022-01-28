function parseExchangeRatesXml(doc) {
	//console.log('rates doc', doc);
	
	return _.chain($(doc).find('item').get())
        .map(item => {
            return _.reduce($('*', item), (item, member) => {
    			let prop = member.tagName.toLowerCase(),
    				value = member.innerHTML;
    			
                item[prop] = value;
                return item;
            }, {});
        })
        .value()
}

function requestExchangeRatesXml(url, loading) {
	loading(true);
	return $.ajax({
        url: './xml-rand.php',
        //url: "./xml-gw.php?url=" + encodeURIComponent(url),
        dataType: 'xml',
        complete: () => loading(false),
    });
}
