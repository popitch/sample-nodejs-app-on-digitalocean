const CURRENCY_NAME_BY_SYMBOL = {
    "BTC":"Bitcoin (BTC)","BTCLN":"Bitcoin LN (BTC)","BTCBEP20":"Bitcoin BEP20 (BTC)","WBTC":"Wrapped BTC (WBTC)","BCH":"Bitcoin Cash (BCH)","BSV":"Bitcoin SV (BSV)","BTG":"Bitcoin Gold (BTG)",
    "ETH":"Ethereum (ETH)","ETHBEP20":"Ethereum BEP20 (ETH)","WETH":"Wrapped ETH (WETH)","ETC":"Ether Classic (ETC)","LTC":"Litecoin (LTC)","XRP":"Ripple (XRP)","XMR":"Monero (XMR)","DOGE":"Dogecoin (DOGE)","MATIC":"Polygon (MATIC)","DASH":"Dash (DASH)","ZEC":"Zcash (ZEC)","USDTOMNI":"Tether Omni (USDT)","USDTERC20":"Tether ERC20 (USDT)","USDTTRC20":"Tether TRC20 (USDT)","USDTBEP20":"Tether BEP20 (USDT)","USDC":"USD Coin (USDC)","TUSD":"TrueUSD (TUSD)","USDP":"Pax Dollar (USDP)","DAI":"Dai (DAI)","BUSD":"Binance USD (BUSD)","XEM":"NEM (XEM)","REP":"Augur (REP)","NEO":"NEO (NEO)","EOS":"EOS (EOS)","IOTA":"IOTA (MIOTA)","LSK":"Lisk (LSK)","ADA":"Cardano (ADA)","XLM":"Stellar (XLM)","TRX":"TRON (TRX)","WAVES":"Waves (WAVES)","OMG":"OMG Network (OMG)","XVG":"Verge (XVG)","ZRX":"0x (ZRX)","BNB":"Binance Coin (BNB)","ICX":"ICON (ICX)","KMD":"Komodo (KMD)","BTT":"BitTorrent (BTT)","BAT":"BAT (BAT)","ONT":"Ontology (ONT)","QTUM":"Qtum (QTUM)","LINK":"Chainlink (LINK)","ATOM":"Cosmos (ATOM)","XTZ":"Tezos (XTZ)","DOT":"Polkadot (DOT)","UNI":"Uniswap (UNI)","RVN":"Ravencoin (RVN)","SOL":"Solana (SOL)","VET":"VeChain (VET)","SHIB":"Shiba Inu (SHIB)","ALGO":"Algorand (ALGO)","MKR":"Maker (MKR)","AVAX":"Avalanche (AVAX)","YFI":"Yearn.finance (YFI)","WMZ":"WMZ","WMR":"WMR","WMP":"WMP","WME":"WME","WMB":"WMB","WMK":"WMK","WMX":"WMX","PMRUSD":"Paymer USD","PMRRUB":"Paymer RUB","PMUSD":"Perfect Money USD","PMEUR":"Perfect Money EUR","PMBTC":"Perfect Money BTC","PMVUSD":"PM e-Voucher USD","YAMRUB":"ЮMoney","QWRUB":"QIWI RUB","QWKZT":"QIWI KZT","PPUSD":"PayPal USD","PPRUB":"PayPal RUB","PPEUR":"PayPal EUR","PPGBP":"PayPal GBP","ADVCUSD":"Advanced Cash USD","ADVCRUB":"Advanced Cash RUB","ADVCEUR":"Advanced Cash EUR","ADVCUAH":"Advanced Cash UAH","ADVCKZT":"Advanced Cash KZT","ADVCTRY":"Advanced Cash TRY","PRUSD":"Payeer USD","PRRUB":"Payeer RUB","PREUR":"Payeer EUR","SKLUSD":"Skrill USD","SKLEUR":"Skrill EUR","IDAMD":"Idram","PAXUMUSD":"Paxum","CPTSUSD":"Capitalist USD","CPTSRUB":"Capitalist RUB","NTLRUSD":"Neteller USD","NTLREUR":"Neteller EUR","PSRUSD":"PaySera USD","PSREUR":"PaySera EUR","ECPZUSD":"ecoPayz","NIXUSD":"NixMoney USD","NIXEUR":"NixMoney EUR","GMUAH":"Global24","VLSPUSD":"VelesPay","EPAYUSD":"Epay USD","EPAYEUR":"Epay EUR","ALPCNY":"Alipay","PNRUSD":"Payoneer","MWRUB":"Счет телефона RUB","MWUAH":"Счет телефона UAH","TRDUSD":"Криптобиржи USD","TRDEUR":"Криптобиржи EUR","EXMUSD":"Exmo USD","EXMRUB":"Exmo RUB","EXMUAH":"Exmo UAH","EXMBTC":"Exmo BTC","EXMUSDT":"Exmo USDT","BNACRUB":"Binance RUB","BNACUAH":"Binance UAH","CRXUSD":"Cryptex","KUNAUAH":"Kuna","GRNTXRUB":"Garantex","WHTBTUSD":"WhiteBIT","SBERRUB":"Сбербанк","SBERDRUB":"Сбербанк Код","ACRUB":"Альфа-Банк","ACCUSD":"Альфа cash-in USD","ACCRUB":"Альфа cash-in RUB","TCSBRUB":"Тинькофф","TCSBCRUB":"Тинькофф cash-in","TCSBQRUB":"Тинькофф QR","TBRUB":"ВТБ","RUSSTRUB":"Русский Стандарт","AVBRUB":"Авангард","PSBRUB":"Промсвязьбанк","GPBRUB":"Газпромбанк","KUKRUB":"Кукуруза","RFBRUB":"Райффайзен","RNKBRUB":"РНКБ","OPNBRUB":"Открытие","POSTBRUB":"Почта Банк","RSHBRUB":"Россельхозбанк","ROSBRUB":"Росбанк","MTSBRUB":"МТС Банк","HCBRUB":"Хоум Кредит","P24USD":"Приват 24 USD","P24UAH":"Приват 24 UAH","RFBUAH":"Райффайзен UAH","OSDBUAH":"Ощадбанк","USBUAH":"УкрСиббанк","PMBBUAH":"ПУМБ","MONOBUAH":"Монобанк","SBERUAH":"Сбербанк UAH","ACUAH":"Альфа-Банк UAH","BLRBBYN":"Беларусбанк","HLKBKZT":"HalykBank","SBERKZT":"Сбербанк KZT","FRTBKZT":"ForteBank","KSPBKZT":"Kaspi Bank","JSNBKZT":"Jysan Bank","CARDUSD":"Visa/MasterCard USD","CARDRUB":"Visa/MasterCard RUB","CARDEUR":"Visa/MasterCard EUR","CARDUAH":"Visa/MasterCard UAH","CARDBYN":"Visa/MasterCard BYN","CARDKZT":"Visa/MasterCard KZT","CARDSEK":"Visa/MasterCard SEK","CARDPLN":"Visa/MasterCard PLN","CARDMDL":"Visa/MasterCard MDL","CARDAMD":"Visa/MasterCard AMD","CARDGBP":"Visa/MasterCard GBP","CARDCNY":"Visa/MasterCard CNY","CARDTRY":"Visa/MasterCard TRY","CARDKGS":"Visa/MasterCard KGS","MIRCRUB":"Карта Мир","UPCNY":"Карта UnionPay","UZCUZS":"Карта UZCARD","HUMOUZS":"Карта HUMO","WIREUSD":"Любой банк USD","WIRERUB":"Любой банк RUB","WIREEUR":"Любой банк EUR","WIREUAH":"Любой банк UAH","WIREBYN":"Любой банк BYN","WIREKZT":"Любой банк KZT","WIREGEL":"Любой банк GEL","WIREGBP":"Любой банк GBP","WIRECNY":"Любой банк CNY","WIRETRY":"Любой банк TRY","WIREPLN":"Любой банк PLN","WIRETHB":"Любой банк THB","WIREINR":"Любой банк INR","WIRENGN":"Любой банк NGN","WIREIDR":"Любой банк IDR","SEPAEUR":"Sepa EUR","ERIPBYN":"ЕРИП Расчет","SBPRUB":"СБП","STLMRUB":"Счет ИП или ООО","REVBUSD":"Revolut USD","REVBEUR":"Revolut EUR","WUUSD":"WU USD","WUEUR":"WU EUR","WURUB":"WU RUB","MGUSD":"MoneyGram USD","MGEUR":"MoneyGram EUR","CNTUSD":"Contact USD","CNTRUB":"Contact RUB","GCMTUSD":"Золотая Корона USD","GCMTRUB":"Золотая Корона RUB","USTMUSD":"UNI USD","USTMRUB":"UNI RUB",
    "RMTFUSD":"Ria USD","RMTFEUR":"Ria EUR","CASHUSD":"Наличные USD","CASHRUB":"Наличные RUB","CASHEUR":"Наличные EUR","CASHUAH":"Наличные UAH","CASHBYN":"Наличные BYN","CASHKZT":"Наличные KZT","CASHGBP":"Наличные GBP","CASHAED":"Наличные AED"
};

const CURRENCY_ID_BY_SYMBOL = {"BTC":"43","WBTC":"73","BCH":"172","BSV":"137","BTG":"184","ETH":"212","WETH":"218","ETC":"160","LTC":"99","XRP":"161","XMR":"149","DOGE":"115","MATIC":"138","DASH":"140","ZEC":"162","USDT":"208","USDC":"23","TUSD":"24","USDP":"189","DAI":"203","BUSD":"206","XEM":"173","REP":"174","NEO":"177","EOS":"178","MIOTA":"179","LSK":"180","ADA":"181","XLM":"182","TRX":"185","WAVES":"133","OMG":"48","XVG":"124","ZRX":"168","BNB":"19","ICX":"104","KMD":"134","BTT":"27","BAT":"61","ONT":"135","QTUM":"26","LINK":"197","ATOM":"198","XTZ":"175","DOT":"201","UNI":"202","RVN":"205","SOL":"82","VET":"8","SHIB":"210","ALGO":"216","MKR":"213","AVAX":"217","YFI":"220"},
	CURRENCY_SYMBOL_BY_ID = {8: 'VET', 19: 'BNB', 23: 'USDC', 24: 'TUSD', 26: 'QTUM', 27: 'BTT', 43: 'BTC', 48: 'OMG', 61: 'BAT', 73: 'WBTC', 82: 'SOL', 99: 'LTC', 104: 'ICX', 115: 'DOGE', 124: 'XVG', 133: 'WAVES', 134: 'KMD', 135: 'ONT', 137: 'BSV', 138: 'MATIC', 140: 'DASH', 149: 'XMR', 160: 'ETC', 161: 'XRP', 162: 'ZEC', 168: 'ZRX', 172: 'BCH', 173: 'XEM', 174: 'REP', 175: 'XTZ', 177: 'NEO', 178: 'EOS', 179: 'MIOTA', 180: 'LSK', 181: 'ADA', 182: 'XLM', 184: 'BTG', 185: 'TRX', 189: 'USDP', 197: 'LINK', 198: 'ATOM', 201: 'DOT', 202: 'UNI', 203: 'DAI', 205: 'RVN', 206: 'BUSD', 208: 'USDT', 210: 'SHIB', 212: 'ETH', 213: 'MKR', 216: 'ALGO', 217: 'AVAX', 218: 'WETH', 220: 'YFI'},
	CURRENCY_IDS = [43, 73, 172, 137, 184, 212, 218, 160, 99, 161, 149, 115, 138, 140, 162, 208, 23, 24, 189, 203, 206, 173, 174, 177, 178, 179, 180, 181, 182, 185, 133, 48, 124, 168, 19, 104, 134, 27, 61, 135, 26, 197, 198, 175, 201, 202, 205, 82, 8, 210, 216, 213, 217, 220, 211],
	
	CURRENCY_ANY_LIST = CURRENCY_IDS.map(id => {
        const symbol = CURRENCY_SYMBOL_BY_ID[id];
        return {
            id: id,
            symbol: symbol,
            name: CURRENCY_NAME_BY_SYMBOL[symbol] || symbol,
        };
    });

function pairsToCurrenciesFrom(pairs) {
    var lo = 'undefined' !== typeof _ ? _ : require('lodash'); // for SSR
    
    return _.chain(pairs)
        .map((branch, from) => ({
            id: CURRENCY_ID_BY_SYMBOL[from],
            name: CURRENCY_NAME_BY_SYMBOL[from] || '"' + from + '"',
            symbol: from,
            weight: lo.reduce(branch, (s, w) => s + w, 0),
        }))
        .sortBy(p => - p.weight)
        .value();
}

function pairsToCurrenciesTo(pairs) {
    var lo = 'undefined' !== typeof _ ? _ : require('lodash'); // for SSR
    
    const tree = pairs,
        toAll = lo.chain(tree).map(branch =>
            lo.map(branch, (w, to) => ({
                id: CURRENCY_ID_BY_SYMBOL[to],
                name: CURRENCY_NAME_BY_SYMBOL[to] || '"' + to + '"',
                symbol: to,
                weight: w,
            }))
        )
        .flatten()
        .value();
    
    return lo.chain(toAll)
        .groupBy('symbol')
        .map((group, to) => lo.extend(group[0], {
            weight: group.reduce((w, to) => w + to.weight, 0),
        }))
        .sortBy(p => - p.weight)
        .value();
}

// flags
const FLAG_BY_SYMBOL = {
    floating: {
        title: 'Плавающий курс обмена',
    },
    percent: {
        title: 'Дополнительная комиссия',
    },
    manual: {
        title: 'Ручной обмен',
    },
    otherin: {
        title: 'Прием на стороннюю платежную систему',
    },
    otherout: {
        title: 'Выплата со сторонней платежной системы',
    },
    card2card: {
        title: 'Прием карт переводом Card2Card',
    },
    delivery: {
        title: 'Отсутствует офис в заданном городе',
    },
    verifying: {
        title: 'Верификация документов',
    },
    cardverify: {
        title: 'Верификация карты',
    },
    reg: {
        title: 'Регистрация обязательна',
    },
    purse: {
        title: 'Для сервисов кошельков',
    },
    official: {
        title: 'Переводы от юридического лица',
    },
    delay: {
        title: 'Холд при приеме средств',
    },
};

// module.exports for SSR
if (typeof module !== 'undefined') {
    module.exports = {
        CURRENCY_NAME_BY_SYMBOL: CURRENCY_NAME_BY_SYMBOL,
        CURRENCY_ID_BY_SYMBOL: CURRENCY_ID_BY_SYMBOL,
        CURRENCY_SYMBOL_BY_ID: CURRENCY_SYMBOL_BY_ID,
        CURRENCY_IDS: CURRENCY_IDS,
        FLAG_BY_SYMBOL: FLAG_BY_SYMBOL,
        
        //CURRENCY_ANY_LIST: CURRENCY_ANY_LIST,
        
        pairsToCurrenciesFrom: pairsToCurrenciesFrom,
        pairsToCurrenciesTo: pairsToCurrenciesTo,
    };
}
