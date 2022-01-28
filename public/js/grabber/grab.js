/*#!console

// loader
loadScript("https://acidome.ru/lab/xxchange/js/grabber/grab.js");

// only js loader
function loadScript(url) {
    const s = document.createElement('script');
    s.src = url;
    document.body.appendChild(s);
}

loadScript('https://cdn.jsdelivr.net/npm/underscore@latest/underscore-umd-min.js');
loadScript('https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js');



// all rates
ratesAll = _.range(0, localStorage.length).map(i => localStorage.getItem(localStorage.key(i))).map(JSON.parse).filter(isNaN).flat()
    .map(n => (Array.isArray(n.history) ? n.history : []).map(hn => { hn.updatedAt = n.dt; return hn }))
    .flat()


// all by id => by rate pair
lastRatesByPairById = _.chain(ratesAll)
    .filter(r => r.bcId && r.changer)
    .groupBy(r => r.bcId + '-' + r.changer)
    .mapObject(g => _.chain(g)
        .groupBy(r => r.from + '+' + r.to)
        .mapObject(gg => _.sortBy(gg, r => r.updatedAt).pop())
        .value()
    )
    .value()


// last only rates
lastOnlyRates = _.values(_.mapObject(lastRatesByPairById, _.values)).flat()


// unique rate params
uniqRateParams = _.chain(ratesAll)
    .reduce((a,r) => {
        _.each(r.param, (v,k) => {
            a[k] = a[k] || [];
            a[k].push(v);
        });
        return a;
    }, {})
    .mapObject(_.unique)
    .mapObject(a => a.length === 1 ? a[0] : a)
    .value()


// exchangers with tested flags(param)
allExchangersById = _.chain(lastOnlyRates )
    .groupBy(r => r.bcId)
    .mapObject((g, exid) => {
        const ch = {
            id: g[0].bcId,
            name: g[0].changer,
        };
        ch.flags = _.reduce(g, (param, r) => {
            return _.reduce(r.param, (param, v, k) => {
                param[k] = param[k] ? _.isArray(param[k]) ? param[k] : [ param[k] ] : [];
                param[k].push(v);
                return param;
            }, param);
        }, {});
        return ch;
    })
    .each(ch => ch.flags = _.mapObject(ch.flags, _.uniq))
    .each(ch => ch.flags = _.mapObject(ch.flags, a => a.length === 1 ? true : a))
    .each(ch => ch.flags = _.all(ch.flags, _.isBoolean) ? _.keys(ch.flags).sort() : ch.flags)
    .value()


// load saved
chgrz = ...

// update with new
_.each(allExchangersById, nch => {
    const ch = _.findWhere(chgrz, { id: nch.id });// || console.error('ch with id', ch.id, 'not found');
    if (!ch) {
        chgrz.push(_.extend(_.clone(nch), {
            xml: "",
            exUrlTmpl: "",
            xmlVerified: false,
        }));
    } else {
        // compare flags
        _.isEqual(ch.flags, nch.flags) || console.error('new flags given for', ch.id, 'with', ch.flags, '=>', nch.flags);
        ch.flags = nch.flags.slice(0);
        
        
    }
})


// export list
console.log(JSON.stringify(chgrz, null, 4));




// ....
// changers
changersList = _.map(uniqRateParams, (flags, keyPair) => {
    const parts = keyPair.split('-');
    return {
        id: Number(parts[0]),
        name: parts.slice(1).join('-'),
        flags: flags ? flags.split(',') : [],
    };
});




// testing xml sources
_.filter(chgrz, c => !c.xmlVerified && c.xml).forEach(chgr => {
    const xml = chgr.xml.replace('request-exportxml.xml', 'pairs-exportxml.xml');

    $.ajax('https://acidome.ru/lab/xxchange/xml-gw.php?url=' + encodeURIComponent(xml))
        .done(resp => {
            chgr.xmlVerified = !! resp.match(/<\?xml[\s\S]*<rates>/);
            console.log(chgr.xmlVerified, xml);

            if (chgr.xmlVerified) chgr.xml = xml;
        });
});


*/



loadScript('https://cdn.jsdelivr.net/npm/underscore@latest/underscore-umd-min.js');
loadScript('https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js');
//loadScript('');

const CURRENCY_ID_BY_SYMBOL = {"BTC":"43","WBTC":"73","BCH":"172","BSV":"137","BTG":"184","ETH":"212","WETH":"218","ETC":"160","LTC":"99","XRP":"161","XMR":"149","DOGE":"115","MATIC":"138","DASH":"140","ZEC":"162","USDT":"208","USDC":"23","TUSD":"24","USDP":"189","DAI":"203","BUSD":"206","XEM":"173","REP":"174","NEO":"177","EOS":"178","MIOTA":"179","LSK":"180","ADA":"181","XLM":"182","TRX":"185","WAVES":"133","OMG":"48","XVG":"124","ZRX":"168","BNB":"19","ICX":"104","KMD":"134","BTT":"27","BAT":"61","ONT":"135","QTUM":"26","LINK":"197","ATOM":"198","XTZ":"175","DOT":"201","UNI":"202","RVN":"205","SOL":"82","VET":"8","SHIB":"210","ALGO":"216","MKR":"213","AVAX":"217","YFI":"220","":"211"},
	CURRENCY_IDS = [43, 73, 172, 137, 184, 212, 218, 160, 99, 161, 149, 115, 138, 140, 162, 208, 23, 24, 189, 203, 206, 173, 174, 177, 178, 179, 180, 181, 182, 185, 133, 48, 124, 168, 19, 104, 134, 27, 61, 135, 26, 197, 198, 175, 201, 202, 205, 82, 8, 210, 216, 213, 217, 220, 211],

    CURRENCY_M = 55;

setTimeout(() => {
	CURRENCY_SYMBOL_BY_ID = _.invert(CURRENCY_ID_BY_SYMBOL)
}, 2000);
	
let iter = localStorage.getItem('iter') || 0,
    currDir = () => linear2direction(iter),
    nextDir = () => {
        localStorage.setItem('iter', ++iter);
        return currDir();
    },
    loadExchangeDir = () => {
        [lc_curr, rc_curr] = currDir();
        update_rates();
    },

    receiveDirTableResponse = (responseText, respDoc, from, to) => {
        //console.log('parse here, from', from, 'to', to, responseText.length, 'b');
        
        // save ex.dir-result
        const hist = JSON.parse(localStorage.getItem(from + ' => ' + to) || '[]');
        hist.push({
            dt: +new Date,
            history: _.map($('table[id="content_table"] tbody tr', respDoc), tr => {
                const $from = $('.bi .fs', tr), $to = $('.bi + .bi', tr),
                    bcId = Number(tr.outerHTML.replace(/\D+(\d+)[\S\s]*/, '$1'));
                
                return {
                    //html: tr.outerHTML,
                    bcId: bcId,
                    changer: $('.ca', tr).text(),
                    amount: $('.ar.arp', tr).text().replace(/\s/g, ''),
                    from: $from.find('small').text(),
                    in: parseFloat($from.text().replace(/\s/g, '')),
                    to: $to.find('small').text(),
                    out: parseFloat($to.text().replace(/\s/g, '')),
                    minamount: $('.bi .fm .fm1', tr).text().replace(/[^0-9.]/g, ''),
                    maxamount: $('.bi .fm .fm2', tr).text().replace(/[^0-9.]/g, ''),
                    param: $('.lbpl > *', tr).get().reduce((a, n) => {
                        a[ n.className ] = n.innerHTML.replace(/<(br|\/)[^>]*>/g, '\n').replace(/<[^>]*>/g, '').trim();
                        return a;
                    }, {}),
                };
            }).filter(r => r.bcId && r.changer),
        });
        localStorage.setItem(from + ' => ' + to, JSON.stringify(hist));

        // if can't
        if (localStorageSize() > 5000000) return console.error('localStorageSize() > 5000000, fullestlyfilled O_O');

        // if can
        nextDir();
        setTimeout(loadExchangeDir, 34000);
    };

const 
  SHUFFLED_55 = '756,2399,2501,1863,579,907,1206,2797,860,350,2252,848,2700,464,1862,2779,2681,1238,2686,1449,744,2982,2140,1901,859,647,1892,2060,216,353,1187,2363,1912,1765,983,1179,604,1994,1820,463,266,2678,484,597,2752,1984,2902,1455,399,761,2963,398,2216,1284,1886,496,904,1612,2299,511,2080,2825,1936,2614,1406,817,519,183,445,176,608,1312,671,1677,2132,1746,2720,918,1953,2104,24,785,1982,2158,2609,755,2703,2309,219,710,2448,1331,1882,146,2008,1687,2484,18,1198,1583,2901,2751,2890,2744,2021,966,1906,2248,402,2848,2649,128,778,63,2314,651,1535,1464,234,1489,1213,21,2045,1831,729,2656,1466,1722,958,468,1484,2421,2515,1130,2122,726,2645,1998,808,1939,167,2373,2578,1493,1280,2617,135,1896,2783,916,134,2394,2840,1350,2431,2230,2772,2412,872,1861,217,1622,1511,584,69,2428,1777,1895,2895,2636,1025,2254,2930,1942,2378,329,486,1332,2184,41,2875,152,2653,291,684,2926,781,1062,680,447,472,1983,827,1127,794,245,2270,1256,1143,1739,2809,1978,1625,1038,229,2264,2935,908,1692,981,1825,495,316,1123,2434,2276,2613,347,2069,706,457,267,2114,961,2033,2662,1415,470,179,79,2449,60,1617,2217,1306,1596,2400,1373,573,2839,1512,2145,1643,2477,2468,22,2602,1970,2894,1999,1470,1536,2693,2183,1875,2987,1377,2438,256,2062,1696,1186,996,2833,517,2727,453,2623,2359,2367,1902,2285,792,2699,443,626,2803,356,1321,2117,2076,2674,2631,198,2591,2670,2545,1575,1500,163,1522,605,1549,1650,558,2039,2947,1814,2342,336,533,2461,1835,2504,121,1888,1702,2605,2112,1564,492,995,1384,2194,171,2296,889,376,2879,259,1737,377,3022,1172,1639,208,1841,1089,985,845,1550,2430,2178,3000,2637,1924,1364,1039,1623,1548,1371,2823,1519,1442,1245,1475,598,2119,2227,320,867,1485,1117,2156,1664,1110,1638,1520,2864,1168,2319,257,2321,2239,2386,780,1974,2125,2455,192,2882,791,2291,1601,1422,571,2486,2280,1613,1228,762,2929,1595,1930,1793,254,1155,1099,2869,1290,2262,676,1001,2490,2714,2423,97,2172,2643,1770,302,155,190,435,554,2524,503,1308,1988,599,2543,471,2736,105,1838,1150,1943,1972,569,2692,2553,1959,2084,1597,2475,639,370,870,1753,990,2688,2589,2238,725,2757,2297,1671,687,2150,2815,1948,2312,1274,566,2078,2705,610,2632,1849,1376,1963,2544,20,576,2120,2658,232,1990,40,1428,294,1435,1829,1889,1630,631,2336,2165,2007,2213,2470,2690,2435,695,1530,1840,2494,343,3023,1589,161,2097,491,1444,1773,2,78,2005,2651,713,1682,3019,396,925,1272,2746,2592,1642,1241,1477,2676,2622,2768,2628,589,369,2361,955,47,2173,2308,2101,926,783,1586,500,865,2444,1207,1177,542,1163,1385,1858,963,2711,1189,55,1774,2872,1985,2207,1333,2536,1088,2831,2782,1067,718,2464,498,1684,2569,2638,1122,885,1044,1258,1619,2267,648,906,612,2990,311,697,2860,2550,126,2979,1165,51,413,131,1615,1784,1508,788,520,2087,2973,1000,2487,365,2695,897,2892,3011,518,941,546,404,632,265,1486,629,2992,2148,2177,670,609,1046,2266,2673,2633,704,577,816,587,357,1135,1633,1567,1618,2801,1547,2283,2385,1329,2498,1121,593,2138,1468,1712,1366,547,1460,2175,295,2680,1574,2272,991,1068,1200,304,2721,1389,467,2995,1427,2850,393,355,915,306,308,763,211,813,595,2629,2337,1291,1987,2339,1827,1019,2903,2917,2203,779,2392,1844,2358,1413,2964,530,754,1721,2642,2755,2557,2192,2852,115,1473,2774,1368,473,2775,1204,2223,1620,2095,1726,2517,1707,2650,2794,1010,2849,1608,962,6,1653,458,1783,2967,3,536,1239,741,297,1381,1860,2209,227,1229,2586,1365,2275,407,1395,2025,1176,2865,1283,2985,44,1937,2377,341,2323,2168,999,2067,2820,312,2661,2179,1887,1236,1372,1160,2050,2607,1543,556,2171,1590,1532,1911,1138,984,504,181,532,340,2884,1952,1925,3013,1132,1652,43,2277,1036,2380,324,1161,1304,524,422,1724,789,395,16,2936,2900,1602,14,2451,2606,1807,204,1600,920,2441,2897,826,2465,537,1661,819,2004,87,1182,144,1414,2443,2855,368,333,1242,623,937,574,1719,2923,2950,1090,1286,751,1362,815,1524,351,1205,2537,100,262,2951,731,89,2204,1847,1266,1894,1768,2427,565,2984,2038,2098,2760,1285,1776,123,1871,1234,220,2626,84,679,652,976,2013,1164,218,3005,1100,2579,715,2166,2978,2521,11,752,1226,2368,1162,914,96,2759,838,432,1824,2576,2153,414,2313,1674,525,238,1644,661,880,2496,94,2777,106,2924,1492,286,90,634,2369,939,787,874,2121,98,1112,2236,868,1218,1563,101,1742,1609,2418,424,386,2873,157,1760,658,799,2245,1081,1443,2854,2503,1582,1779,1750,1417,466,903,1222,2410,1323,673,1897,1660,1851,1884,2397,29,765,2788,1591,1418,655,1562,855,1087,833,2493,1049,1573,1950,199,2500,746,507,1681,1570,28,1002,2488,141,644,944,2247,841,2682,2577,844,2581,1183,541,1114,2710,2668,2730,2176,415,1139,825,1075,1341,2717,2302,1704,1922,330,1041,2539,601,230,1628,2035,834,36,2828,1709,309,478,2874,2907,110,2460,1315,1877,900,2019,328,2354,561,390,666,1387,1803,1857,194,2278,1655,1474,847,2284,1173,2243,1180,1836,768,1790,1104,1720,1125,923,2763,2857,1647,1580,2292,2912,942,111,3010,635,1680,2946,405,1968,728,1348,539,2611,2729,1445,2133,169,1230,823,988,818,2885,910,2552,899,31,2396,975,250,736,2590,1296,1598,2346,2836,1542,2351,2981,654,2022,1525,776,2941,1527,173,277,1326,2799,469,2677,978,1799,2704,2615,209,1513,394,764,37,1736,1967,2482,2867,665,231,930,1079,2983,1993,1866,439,61,147,2328,2529,1921,2792,2555,2100,1941,1885,691,2845,1864,1098,1210,1259,2199,323,1064,2940,1070,1056,974,251,253,2599,1767,892,441,1282,348,1826,970,570,1762,1846,572,2452,303,1340,2914,1690,1397,2822,2318,1203,1355,1021,927,951,2519,2300,821,1458,334,2065,1813,2159,1800,2913,374,375,1424,1209,622,385,258,2042,1578,2332,1957,1128,1047,2853,1393,1093,1697,1481,1561,2654,2975,1391,1560,2603,1437,2977,1023,734,2554,2679,449,1225,649,241,139,888,1926,2063,2415,1083,337,1856,116,1816,2151,3018,562,949,1386,2010,1648,2279,954,2546,2585,1080,1832,795,2436,479,1281,2761,384,207,149,2574,182,2526,223,1102,1497,2856,1140,720,200,1303,2295,512,301,34,1254,616,1438,1735,49,2748,1045,1078,451,771,2103,1867,2398,25,1577,2691,2991,2816,2293,2532,943,1137,2725,65,2478,1666,705,1356,416,430,2812,886,2587,2570,3007,1775,2301,549,1111,732,699,485,851,2077,1518,364,1410,552,2479,2379,1592,2447,2641,1403,2834,883,2233,2028,972,863,2057,2663,1432,1870,425,2735,2366,494,2096,2163,2847,1931,1757,2616,1842,1461,2556,854,2723,555,455,2244,2211,1052,2012,202,1764,1022,2733,1675,1040,112,2514,1048,2819,1928,2442,722,884,2027,1405,866,1732,871,2240,138,193,1380,2920,2387,2131,1300,102,820,1465,2502,1679,2818,1495,707,677,2955,696,1711,1024,1004,1017,2953,1116,2813,1794,994,2432,1131,381,2843,1898,1640,2608,1199,3008,656,619,1178,745,1569,8,1791,1980,1766,282,846,730,2851,2769,2006,853,1654,2355,1471,1786,1314,185,99,1459,2357,2058,1480,276,1752,1624,2718,921,1908,153,2016,1409,849,1558,2224,724,690,1154,2627,379,583,506,1273,225,1913,660,1798,1390,1944,891,15,2473,9,2776,122,1201,2595,2456,2896,1268,2878,980,2271,2072,170,739,475,74,2472,1715,2316,1581,2512,747,1945,2665,1792,2315,550,283,2630,317,362,1219,352,1411,2305,693,2102,1269,54,2666,1815,158,1514,1346,1496,784,1396,1823,2538,1066,2827,543,17,2740,1579,924,1027,809,2157,2974,2269,1305,2593,1148,1910,588,2817,878,2910,1147,1899,2023,1009,1469,1169,905,1593,917,2808,1157,1328,2832,72,1249,2180,91,389,798,1837,2790,2741,769,1893,1587,641,1108,118,249,2450,2618,831,1050,1969,1749,698,2130,2048,1292,2047,2085,968,418,2785,154,2149,1649,2059,1534,1566,1101,1571,2572,563,1142,688,2092,625,2422,2683,437,2547,431,332,2202,1933,32,1129,1174,822,2993,354,1175,1113,2108,708,1745,659,2043,233,2281,1307,215,327,2034,358,3002,2286,2567,2715,1900,2962,1439,75,3021,2341,2294,2116,1923,421,1883,2234,829,1353,2542,88,1227,2583,2821,279,1319,3024,2765,1539,1053,1748,260,1188,140,998,3017,210,143,1339,861,1986,1006,373,2409,271,221,1037,1260,2563,2528,1756,1918,2835,2197,2113,514,1830,796,2107,1769,1797,510,452,1874,2169,2228,2533,714,667,1194,2698,476,2904,2343,2906,1646,1754,2167,557,81,197,956,1964,738,359,1202,1717,284,191,2020,505,521,824,1005,38,716,2070,828,627,189,1352,2075,2445,2805,2391,2485,1621,2798,417,2516,1359,1095,797,1342,1955,591,1265,2235,2771,184,2944,1533,1055,800,1429,2274,1810,1714,2787,378,957,292,2659,460,1828,1789,702,727,2126,575,235,2099,934,403,2259,1077,222,2161,224,1673,2802,2826,2111,1277,2612,428,1694,1434,1247,226,2462,86,1358,759,2561,757,177,264,2722,1145,1667,2491,2511,57,1421,314,2943,645,2458,1603,1091,2619,1071,1678,2506,770,2251,136,45,1014,1153,643,270,120,2604,2408,1716,1144,1819,2520,1136,1637,10,2971,119,1448,2079,2307,289,1890,2026,2804,630,188,1338,172,2624,2404,2564,840,2646,2261,2353,1369,252,862,2522,243,287,1940,2381,1668,2210,2764,1310,2731,1629,2317,2789,2905,299,1133,2288,2195,2811,1060,1672,2414,2152,442,501,2273,92,638,1599,989,1730,2584,2290,1904,1855,935,487,1086,1872,1401,2371,689,1905,2915,843,109,440,2424,2255,2420,450,1059,1686,2128,1859,408,1880,1949,2898,2413,2376,1250,2510,178,735,551,1264,653,807,538,39,1029,2888,1289,2356,2842,737,1430,1657,436,1092,615,2639,1253,2250,948,52,2287,2322,2389,2129,1641,2466,2419,2068,1903,444,206,2303,2046,1478,1991,585,864,2743,1788,1082,2657,1237,2054,2712,1085,887,2221,1865,1876,151,1119,1451,2348,2762,2249,2226,1115,77,305,1193,1688,187,2870,1231,2115,2976,1151,2471,3004,132,2582,1845,281,321,1232,3012,1662,1718,1261,2931,2124,2687,1063,1588,717,1891,76,2051,2988,1347,1220,2056,2737,2155,1834,931,1747,1540,1097,971,664,950,114,2696,1572,1878,62,164,275,1392,1848,433,1541,527,1018,130,902,1741,2181,1208,1076,965,1966,2311,2925,1491,107,150,1801,2017,2237,2349,2374,2182,2429,560,1192,711,2030,438,1914,1929,409,1252,1279,805,876,2143,203,692,2344,1467,637,1324,2003,1839,1521,2933,1782,269,804,743,1996,1343,2891,1297,2246,2200,1689,2193,2972,672,2958,2325,482,1450,786,502,686,349,2081,2560,522,2601,180,165,2969,246,2331,748,2225,2791,1012,790,2861,568,360,80,2362,2508,2212,703,1452,2206,1759,1156,2949,490,2011,42,1436,1020,2105,1503,2945,1932,285,406,2350,1958,2088,214,2959,932,873,2457,2994,2324,2734,559,2402,2558,2965,2137,247,835,674,1407,742,531,694,1270,346,2672,474,2551,1043,1802,1244,858,2954,2742,2191,2164,2793,2625,412,477,947,159,2407,1576,1149,108,1962,668,2784,1301,1426,1026,1181,46,1416,1361,2758,366,2481,2694,2106,388,2876,2644,1778,2036,1419,293,760,2795,1529,2170,2863,1658,581,1313,3006,1706,749,2345,553,148,1295,810,1917,4,1919,380,1509,1007,168,1552,2310,523,2952,2961,2335,2382,2372,2889,1124,2329,1808,162,1531,2610,300,1335,515,1565,2405,1634,2439,545,2263,1399,1817,113,1740,2411,896,1084,1336,1605,307,2489,2685,1257,733,567,1927,607,1695,1544,2886,2568,2786,2154,2970,2621,2049,397,1946,2426,133,392,2781,2778,842,636,2531,594,578,59,801,2083,2541,1487,1606,2756,288,2647,1584,1501,2093,2220,1425,2031,701,344,1288,2214,2986,987,244,2928,1375,1920,2549,2724,2480,2750,1320,483,1665,740,1251,662,331,2571,1554,2110,953,895,1976,2716,1170,2911,2859,1457,1751,2401,48,1545,2257,2880,2044,2671,586,175,2810,1003,1498,2922,657,1146,1134,1703,2728,2534,1408,2142,1302,2055,2174,239,2188,1553,1211,1853,1440,1167,881,830,832,1344,1568,898,2998,319,12,2527,1271,1287,382,669,1454,240,228,1723,1907,2780,2838,2588,2190,1965,2664,371,875,2495,2957,3014,1705,633,1515,2919,263,1394,1507,1708,186,363,481,2375,2160,712,280,212,95,1298,1483,960,1725,1008,1011,2559,3001,750,82,1516,1854,2395,1294,802,66,852,933,723,1423,125,2598,1669,1074,1811,1995,2347,2208,2706,23,2866,592,142,2548,877,2883,2205,1382,1479,1555,2071,0,1094,1255,1398,526,1585,1221,773,993,1523,1462,1120,2530,1378,196,901,2370,2265,1700,2766,700,1431,1685,2090,1528,1506,156,882,1614,1915,127,446,2446,2824,2948,806,2492,1744,1763,2807,1809,650,646,812,977,2326,1546,67,600,2433,1822,590,2340,1632,2767,2454,1212,721,793,2956,782,58,2196,1975,1433,2015,1103,528,1316,1663,2229,1309,2989,548,1502,1772,338,986,2037,1456,2713,174,1977,273,2365,2732,869,361,1246,940,1159,71,2932,1607,497,2162,1954,2390,2523,201,278,1981,2565,856,1710,2334,1743,2041,3003,2652,1152,248,2939,1916,2620,1013,2960,296,137,2001,1727,2999,493,777,2518,489,979,683,1796,310,758,642,2330,2909,2997,420,2871,1559,1166,2186,274,2134,1106,2268,508,488,2483,1538,513,2594,1505,70,2416,2232,2968,1196,2024,2002,2061,839,1446,2109,1537,2074,1118,145,1190,1349,850,1420,2256,1636,2260,534,2770,1318,1031,1656,2338,2844,2773,434,3015,1216,391,803,2881,2437,2830,2469,2425,1057,2406,2388,1651,2507,2082,2814,160,2597,2635,2927,268,1235,1317,2868,1058,85,2136,2215,1267,2000,2091,1402,1214,1195,1248,2509,2141,1441,2231,929,1476,2222,2648,129,1881,2014,2241,2118,2417,2333,2453,2258,426,2754,33,1073,945,2918,2938,952,1909,2702,1805,1105,1557,3020,1061,1761,448,997,166,2360,2708,410,339,272,564,936,580,1334,1275,2320,912,1934,913,1109,499,2566,1065,1494,1956,1659,1755,529,1631,1611,2040,1785,1388,1843,893,372,766,2893,1345,454,2640,335,2094,342,465,2505,973,909,1504,1701,2726,1804,772,1215,237,2253,1510,1325,2135,2306,1499,345,606,2364,261,969,1879,1360,2053,992,1224,614,938,1526,1610,1997,2966,1293,2707,2384,2123,326,419,2403,2009,383,2675,1795,919,401,2841,1126,236,2242,1447,1404,2719,2887,27,618,1691,2747,2289,2689,1758,959,1096,2146,753,2298,2540,775,2600,1992,611,1370,2899,1472,516,1033,2018,2383,1383,322,242,50,1979,1699,2189,544,596,2575,1781,1197,617,1806,1351,1015,982,64,1185,2352,195,2738,2440,1771,1322,2393,2655,1051,1676,709,1627,685,1158,255,967,2029,922,13,2147,911,613,1935,2916,1728,1412,1818,640,26,2562,1032,2139,2201,2800,1069,1645,2198,3016,2467,1034,68,1263,1635,2064,205,2739,1713,2806,2073,1971,2596,509,2463,56,1852,480,2474,1072,2525,1490,2573,1278,1693,774,298,1517,318,1850,964,2459,1670,767,2327,1030,2745,7,367,1016,2304,628,2942,1042,2749,2669,535,2144,423,3009,1604,675,1240,93,2753,2282,1482,1869,213,1191,1184,682,1551,456,663,1028,602,1327,117,1367,1453,2086,35,2535,2996,2829,1733,890,124,837,1379,1035,2218,104,73,857,582,879,2476,313,1243,2937,1488,1821,290,1868,400,2697,2089,2837,1276,1363,315,2187,1698,1626,2667,2052,540,1223,2634,2701,1616,2908,2066,2219,2709,2921,427,2858,1833,1683,928,1961,894,1594,1330,1729,814,387,1217,461,2796,325,2877,1400,2032,2846,1171,603,2684,621,1311,1960,811,2660,2127,1374,620,5,19,459,1233,2513,1337,1141,1354,1731,1812,1973,678,1873,462,2862,1,1734,1299,1556,83,1947,2185,624,30,103,1357,411,1780,2980,681,946,2934,1989,1951,1938,719,53,1738,2580,1107,836,2499,2497,1262,1463,429,1787,1054'.split(',').map(Number),
  linear2direction = (i) => {
    const n = Math.floor(i / (CURRENCY_M * CURRENCY_M));

    i %= (CURRENCY_M * CURRENCY_M);

	// suffled version of traversing
	if (CURRENCY_M == 55) {
		i = SHUFFLED_55[ i ];
	}


    const sqr = Math.floor(Math.sqrt(i));

    i -= sqr * sqr;

    let x = sqr - Math.max(0, i - sqr),
        y = 0 + Math.min(i, sqr);

    return [CURRENCY_IDS[ x ], CURRENCY_IDS[ y ], n];
  };

// start
loadExchangeDir();

function sendRequest(req, data, errorEvent) {
  try {
    let [from, to] = data.split(/&from=|&to=|&city=/g).slice(1, 3);

    //console.log(new Date, from, '=>', to);

    req.onreadystatechange = ((orsc) => {
        return () => {
            if (req.readyState != 4) return;

            if (req.responseText.length > 2) {
                // debugger;
                let respDoc = document.createElement('div');
                respDoc.innerHTML = req.responseText;

                console.log(iter, new Date, from, '=>', to, 'storage size', localStorageSize(), '...');
                receiveDirTableResponse(req.responseText, respDoc, from, to);
            }

            return orsc.apply(this, arguments);
        };
    })(req.onreadystatechange);

    req.open('POST', 'https://www.bestchange.ru/action.php', true);
//    req.setRequestHeader('Accept-Charset', 'windows-1251');
//    req.setRequestHeader('Connection', 'keep-alive');
//    req.setRequestHeader('Content-length', data.length);
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=windows-1251');
    req.send(data);
  } catch(e) {
    errorEvent();
    return false;
  }
  return true;
}
function loadScript(url) {
    const s = document.createElement('script');
    s.src = url;
    document.body.appendChild(s);
}


function localStorageSize() {
    return _.range(0, localStorage.length).map(i => localStorage.getItem(localStorage.key(i)).length).reduce((a,b) => a+b, 0);
}