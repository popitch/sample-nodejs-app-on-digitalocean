// start export
startExportQueue();

const pairKeys = () => _.range(0, localStorage.length).map(localStorage.key.bind(localStorage)).filter(parseInt);

// clean
pairKeys().map(key => {
    var json = localStorage.getItem(key),
        times = JSON.parse(json);
   	times = cleanPairData(times);
    localStorage.setItem(key, JSON.stringify(times));
});

function cleanPairData(pairData) {
	return pairData.map(one => {
        one.history = one.history.filter(row => 
        	_.mapObject(row, (v,k) => row[k] = !isNaN(Number(v)) ? Number(v) : v) 
        		&& row.changer
		);
        return one;
    });
}


function startExportQueue() {
	// reset
	if (window.exportQueue) {
		clearTimeout(window.exportQueue);
		window.exportQueue = null;
	}
	
	window.exportQueue = setTimeout(() => {
		// select pair
		const pairKey = pairKeys()[ 0 ], 
			pair = pairKey && pairKey.split(' => '),
			pairData = pairKey && JSON.parse(localStorage.getItem(pairKey));

		// ~ size of storage
		console.warn('pair storage size',
			_.range(0, localStorage.length).map(localStorage.key.bind(localStorage)).map(key => localStorage.getItem(key).length).reduce((s,a) => s+a, 0)
		);
		
		pairData &&
			$.ajax({
				method: 'post',
				url: 'https://acidome.ru/lab/xxchange/import-pair.php',
				data: {
					from: CURRENCY_SYMBOL_BY_ID[ pair[0] ],
					to: CURRENCY_SYMBOL_BY_ID[ pair[1] ],
					from_id: pair[0],
					to_id: pair[1],
					json: JSON.stringify(cleanPairData(pairData)),
				}
			})
			.done(localStorage.removeItem.bind(localStorage, pairKey))
			.done(console.log.bind(console, 'export done (pair key', pair, 'was removed)'))
			.done(startExportQueue);
	}, 34000);
}
