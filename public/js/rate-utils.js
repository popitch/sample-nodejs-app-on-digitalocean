/*
const CURRENCY_NAME_BY_SYMBOL = {
    "BTC":"Bitcoin (BTC)","BTCLN":"Bitcoin LN (BTC)","BTCBEP20":"Bitcoin BEP20 (BTC)","WBTC":"Wrapped BTC (WBTC)","BCH":"Bitcoin Cash (BCH)","BSV":"Bitcoin SV (BSV)","BTG":"Bitcoin Gold (BTG)",
    "ETH":"Ethereum (ETH)","ETHBEP20":"Ethereum BEP20 (ETH)","WETH":"Wrapped ETH (WETH)","ETC":"Ether Classic (ETC)","LTC":"Litecoin (LTC)","XRP":"Ripple (XRP)","XMR":"Monero (XMR)","DOGE":"Dogecoin (DOGE)","MATIC":"Polygon (MATIC)","DASH":"Dash (DASH)","ZEC":"Zcash (ZEC)","USDTOMNI":"Tether Omni (USDT)","USDTERC20":"Tether ERC20 (USDT)","USDTTRC20":"Tether TRC20 (USDT)","USDTBEP20":"Tether BEP20 (USDT)","USDC":"USD Coin (USDC)","TUSD":"TrueUSD (TUSD)","USDP":"Pax Dollar (USDP)","DAI":"Dai (DAI)","BUSD":"Binance USD (BUSD)","XEM":"NEM (XEM)","REP":"Augur (REP)","NEO":"NEO (NEO)","EOS":"EOS (EOS)","IOTA":"IOTA (MIOTA)","LSK":"Lisk (LSK)","ADA":"Cardano (ADA)","XLM":"Stellar (XLM)","TRX":"TRON (TRX)","WAVES":"Waves (WAVES)","OMG":"OMG Network (OMG)","XVG":"Verge (XVG)","ZRX":"0x (ZRX)","BNB":"Binance Coin (BNB)","ICX":"ICON (ICX)","KMD":"Komodo (KMD)","BTT":"BitTorrent (BTT)","BAT":"BAT (BAT)","ONT":"Ontology (ONT)","QTUM":"Qtum (QTUM)","LINK":"Chainlink (LINK)","ATOM":"Cosmos (ATOM)","XTZ":"Tezos (XTZ)","DOT":"Polkadot (DOT)","UNI":"Uniswap (UNI)","RVN":"Ravencoin (RVN)","SOL":"Solana (SOL)","VET":"VeChain (VET)","SHIB":"Shiba Inu (SHIB)","ALGO":"Algorand (ALGO)","MKR":"Maker (MKR)","AVAX":"Avalanche (AVAX)","YFI":"Yearn.finance (YFI)","WMZ":"WMZ","WMR":"WMR","WMP":"WMP","WME":"WME","WMB":"WMB","WMK":"WMK","WMX":"WMX","PMRUSD":"Paymer USD","PMRRUB":"Paymer RUB","PMUSD":"Perfect Money USD","PMEUR":"Perfect Money EUR","PMBTC":"Perfect Money BTC","PMVUSD":"PM e-Voucher USD","YAMRUB":"ЮMoney","QWRUB":"QIWI RUB","QWKZT":"QIWI KZT","PPUSD":"PayPal USD","PPRUB":"PayPal RUB","PPEUR":"PayPal EUR","PPGBP":"PayPal GBP","ADVCUSD":"Advanced Cash USD","ADVCRUB":"Advanced Cash RUB","ADVCEUR":"Advanced Cash EUR","ADVCUAH":"Advanced Cash UAH","ADVCKZT":"Advanced Cash KZT","ADVCTRY":"Advanced Cash TRY","PRUSD":"Payeer USD","PRRUB":"Payeer RUB","PREUR":"Payeer EUR","SKLUSD":"Skrill USD","SKLEUR":"Skrill EUR","IDAMD":"Idram","PAXUMUSD":"Paxum","CPTSUSD":"Capitalist USD","CPTSRUB":"Capitalist RUB","NTLRUSD":"Neteller USD","NTLREUR":"Neteller EUR","PSRUSD":"PaySera USD","PSREUR":"PaySera EUR","ECPZUSD":"ecoPayz","NIXUSD":"NixMoney USD","NIXEUR":"NixMoney EUR","GMUAH":"Global24","VLSPUSD":"VelesPay","EPAYUSD":"Epay USD","EPAYEUR":"Epay EUR","ALPCNY":"Alipay","PNRUSD":"Payoneer","MWRUB":"Счет телефона RUB","MWUAH":"Счет телефона UAH","TRDUSD":"Криптобиржи USD","TRDEUR":"Криптобиржи EUR","EXMUSD":"Exmo USD","EXMRUB":"Exmo RUB","EXMUAH":"Exmo UAH","EXMBTC":"Exmo BTC","EXMUSDT":"Exmo USDT","BNACRUB":"Binance RUB","BNACUAH":"Binance UAH","CRXUSD":"Cryptex","KUNAUAH":"Kuna","GRNTXRUB":"Garantex","WHTBTUSD":"WhiteBIT","SBERRUB":"Сбербанк","SBERDRUB":"Сбербанк Код","ACRUB":"Альфа-Банк","ACCUSD":"Альфа cash-in USD","ACCRUB":"Альфа cash-in RUB","TCSBRUB":"Тинькофф","TCSBCRUB":"Тинькофф cash-in","TCSBQRUB":"Тинькофф QR","TBRUB":"ВТБ","RUSSTRUB":"Русский Стандарт","AVBRUB":"Авангард","PSBRUB":"Промсвязьбанк","GPBRUB":"Газпромбанк","KUKRUB":"Кукуруза","RFBRUB":"Райффайзен","RNKBRUB":"РНКБ","OPNBRUB":"Открытие","POSTBRUB":"Почта Банк","RSHBRUB":"Россельхозбанк","ROSBRUB":"Росбанк","MTSBRUB":"МТС Банк","HCBRUB":"Хоум Кредит","P24USD":"Приват 24 USD","P24UAH":"Приват 24 UAH","RFBUAH":"Райффайзен UAH","OSDBUAH":"Ощадбанк","USBUAH":"УкрСиббанк","PMBBUAH":"ПУМБ","MONOBUAH":"Монобанк","SBERUAH":"Сбербанк UAH","ACUAH":"Альфа-Банк UAH","BLRBBYN":"Беларусбанк","HLKBKZT":"HalykBank","SBERKZT":"Сбербанк KZT","FRTBKZT":"ForteBank","KSPBKZT":"Kaspi Bank","JSNBKZT":"Jysan Bank","CARDUSD":"Visa/MasterCard USD","CARDRUB":"Visa/MasterCard RUB","CARDEUR":"Visa/MasterCard EUR","CARDUAH":"Visa/MasterCard UAH","CARDBYN":"Visa/MasterCard BYN","CARDKZT":"Visa/MasterCard KZT","CARDSEK":"Visa/MasterCard SEK","CARDPLN":"Visa/MasterCard PLN","CARDMDL":"Visa/MasterCard MDL","CARDAMD":"Visa/MasterCard AMD","CARDGBP":"Visa/MasterCard GBP","CARDCNY":"Visa/MasterCard CNY","CARDTRY":"Visa/MasterCard TRY","CARDKGS":"Visa/MasterCard KGS","MIRCRUB":"Карта Мир","UPCNY":"Карта UnionPay","UZCUZS":"Карта UZCARD","HUMOUZS":"Карта HUMO","WIREUSD":"Любой банк USD","WIRERUB":"Любой банк RUB","WIREEUR":"Любой банк EUR","WIREUAH":"Любой банк UAH","WIREBYN":"Любой банк BYN","WIREKZT":"Любой банк KZT","WIREGEL":"Любой банк GEL","WIREGBP":"Любой банк GBP","WIRECNY":"Любой банк CNY","WIRETRY":"Любой банк TRY","WIREPLN":"Любой банк PLN","WIRETHB":"Любой банк THB","WIREINR":"Любой банк INR","WIRENGN":"Любой банк NGN","WIREIDR":"Любой банк IDR","SEPAEUR":"Sepa EUR","ERIPBYN":"ЕРИП Расчет","SBPRUB":"СБП","STLMRUB":"Счет ИП или ООО","REVBUSD":"Revolut USD","REVBEUR":"Revolut EUR","WUUSD":"WU USD","WUEUR":"WU EUR","WURUB":"WU RUB","MGUSD":"MoneyGram USD","MGEUR":"MoneyGram EUR","CNTUSD":"Contact USD","CNTRUB":"Contact RUB","GCMTUSD":"Золотая Корона USD","GCMTRUB":"Золотая Корона RUB","USTMUSD":"UNI USD","USTMRUB":"UNI RUB",
    "RMTFUSD":"Ria USD","RMTFEUR":"Ria EUR","CASHUSD":"Наличные USD","CASHRUB":"Наличные RUB","CASHEUR":"Наличные EUR","CASHUAH":"Наличные UAH","CASHBYN":"Наличные BYN","CASHKZT":"Наличные KZT","CASHGBP":"Наличные GBP","CASHAED":"Наличные AED"
};
*/

const CURRENCY_NAME_BY_SYMBOL = {"BTC":"Bitcoin (BTC)","BTCLN":"Bitcoin LN (BTC)","BTCBEP20":"Bitcoin BEP20 (BTCB)","WBTC":"Wrapped BTC (WBTC)","BCH":"Bitcoin Cash (BCH)","BSV":"Bitcoin SV (BSV)","BTG":"Bitcoin Gold (BTG)","ETH":"Ethereum (ETH)","ETHBEP20":"Ethereum BEP20 (ETH)","WETH":"Wrapped ETH (WETH)","ETC":"Ether Classic (ETC)","LTC":"Litecoin (LTC)","XRP":"Ripple (XRP)","XMR":"Monero (XMR)","DOGE":"Dogecoin (DOGE)","MATIC":"Polygon (MATIC)","DASH":"Dash (DASH)","ZEC":"Zcash (ZEC)","USDTOMNI":"Tether Omni (USDT)","USDTERC20":"Tether ERC20 (USDT)","USDTTRC20":"Tether TRC20 (USDT)","USDTBEP20":"Tether BEP20 (USDT)","USDTSOL":"Tether SOL (USDT)","USDCERC20":"USDCoin ERC20 (USDC)","USDCTRC20":"USDCoin TRC20 (USDC)","TUSD":"TrueUSD (TUSD)","USDP":"Pax Dollar (USDP)","DAI":"Dai (DAI)","BUSD":"Binance USD (BUSD)","UST":"TerraUSD (UST)","XEM":"NEM (XEM)","NEO":"NEO (NEO)","EOS":"EOS (EOS)","IOTA":"IOTA (MIOTA)","ADA":"Cardano (ADA)","XLM":"Stellar (XLM)","TRX":"TRON (TRX)","WAVES":"Waves (WAVES)","OMG":"OMG Network (OMG)","XVG":"Verge (XVG)","ZRX":"0x (ZRX)","BNB":"Binance Coin (BNB)","ICX":"ICON (ICX)","KMD":"Komodo (KMD)","BTTC":"BitTorrent (BTTC)","BAT":"BAT (BAT)","ONT":"Ontology (ONT)","QTUM":"Qtum (QTUM)","LINK":"Chainlink (LINK)","ATOM":"Cosmos (ATOM)","XTZ":"Tezos (XTZ)","DOT":"Polkadot (DOT)","UNI":"Uniswap (UNI)","RVN":"Ravencoin (RVN)","SOL":"Solana (SOL)","VET":"VeChain (VET)","SHIBERC20":"Shiba ERC20 (SHIB)","SHIBBEP20":"Shiba BEP20 (SHIB)","ALGO":"Algorand (ALGO)","MKR":"Maker (MKR)","AVAX":"Avalanche (AVAX)","YFI":"Yearn.finance (YFI)","MANA":"Decentraland (MANA)","LUNA":"Terra (LUNA)","NEAR":"NEAR Protocol (NEAR)","CRO":"Cronos (CRO)","TON":"Toncoin (TON)","WMZ":"WebMoney WMZ","WME":"WebMoney WME","WMK":"WebMoney WMK","WMX":"WebMoney WMX","PMRUSD":"Paymer USD","PMUSD":"Perfect Money USD","PMEUR":"Perfect Money EUR","PMBTC":"Perfect Money BTC","PMVUSD":"PM e-Voucher USD","YAMRUB":"ЮMoney RUB","QWRUB":"QIWI RUB","QWKZT":"QIWI KZT","PPUSD":"PayPal USD","PPRUB":"PayPal RUB","PPEUR":"PayPal EUR","PPGBP":"PayPal GBP","ADVCUSD":"Advanced Cash USD","ADVCRUB":"Advanced Cash RUB","ADVCEUR":"Advanced Cash EUR","ADVCUAH":"Advanced Cash UAH","ADVCKZT":"Advanced Cash KZT","ADVCTRY":"Advanced Cash TRY","PRUSD":"Payeer USD","PRRUB":"Payeer RUB","PREUR":"Payeer EUR","SKLUSD":"Skrill USD","SKLEUR":"Skrill EUR","IDAMD":"Idram AMD","PAXUMUSD":"Paxum USD","CPTSUSD":"Capitalist USD","CPTSEUR":"Capitalist EUR","CPTSRUB":"Capitalist RUB","NTLRUSD":"Neteller USD","NTLREUR":"Neteller EUR","PSRUSD":"PaySera USD","PSREUR":"PaySera EUR","ECPZUSD":"ecoPayz USD","NIXUSD":"NixMoney USD","NIXEUR":"NixMoney EUR","GMUAH":"Global24 UAH","EPAYUSD":"Epay USD","EPAYEUR":"Epay EUR","ALPCNY":"Alipay CNY","PNRUSD":"Payoneer USD","MWRUB":"Счет телефона RUB","MWUAH":"Счет телефона UAH","TRDUSD":"Криптобиржи USD","TRDEUR":"Криптобиржи EUR","EXMUSD":"Exmo USD","EXMRUB":"Exmo RUB","EXMUAH":"Exmo UAH","EXMBTC":"Exmo BTC","EXMUSDT":"Exmo USDT","BNACRUB":"Binance RUB","CRXUSD":"Cryptex USD","KUNAUAH":"Kuna UAH","GRNTXRUB":"Garantex RUB","WHTBTUSD":"WhiteBIT USD","SBERRUB":"Сбербанк RUB","ACRUB":"Альфа-Банк RUB","ACCUSD":"Альфа cash-in USD","ACCRUB":"Альфа cash-in RUB","TCSBRUB":"Тинькофф RUB","TCSBCRUB":"Тинькофф cash-in RUB","TCSBQRUB":"Тинькофф QR RUB","TBRUB":"ВТБ RUB","RUSSTRUB":"Русский Стандарт RUB","AVBRUB":"Авангард RUB","PSBRUB":"Промсвязьбанк RUB","GPBRUB":"Газпромбанк RUB","KUKRUB":"Кукуруза RUB","RFBRUB":"Райффайзен RUB","RNKBRUB":"РНКБ RUB","OPNBRUB":"Открытие RUB","POSTBRUB":"Почта Банк RUB","RSHBRUB":"Россельхозбанк RUB","ROSBRUB":"Росбанк RUB","MTSBRUB":"МТС Банк RUB","HCBRUB":"Хоум Кредит RUB","P24USD":"Приват 24 USD","P24UAH":"Приват 24 UAH","RFBUAH":"Райффайзен UAH","OSDBUAH":"Ощадбанк UAH","USBUAH":"УкрСиббанк UAH","PMBBUAH":"ПУМБ UAH","MONOBUAH":"Монобанк UAH","SBERUAH":"Сбербанк UAH","ACUAH":"Альфа-Банк UAH","BLRBBYN":"Беларусбанк BYN","HLKBKZT":"HalykBank KZT","SBERKZT":"Сбербанк KZT","FRTBKZT":"ForteBank KZT","KSPBKZT":"Kaspi Bank KZT","JSNBKZT":"Jysan Bank KZT","CARDUSD":"Visa/MasterCard USD","CARDRUB":"Visa/MasterCard RUB","CARDEUR":"Visa/MasterCard EUR","CARDUAH":"Visa/MasterCard UAH","CARDBYN":"Visa/MasterCard BYN","CARDKZT":"Visa/MasterCard KZT","CARDSEK":"Visa/MasterCard SEK","CARDPLN":"Visa/MasterCard PLN","CARDMDL":"Visa/MasterCard MDL","CARDAMD":"Visa/MasterCard AMD","CARDGBP":"Visa/MasterCard GBP","CARDCNY":"Visa/MasterCard CNY","CARDTRY":"Visa/MasterCard TRY","CARDKGS":"Visa/MasterCard KGS","CARDCAD":"Visa/MasterCard CAD","CARDBGN":"Visa/MasterCard BGN","CARDHUF":"Visa/MasterCard HUF","CARDCZK":"Visa/MasterCard CZK","CARDNOK":"Visa/MasterCard NOK","MIRCRUB":"Карта Мир RUB","UPCNY":"Карта UnionPay CNY","UZCUZS":"Карта UZCARD UZS","HUMOUZS":"Карта HUMO UZS","WIREUSD":"Любой банк USD","WIRERUB":"Любой банк RUB","WIREEUR":"Любой банк EUR","WIREUAH":"Любой банк UAH","WIREBYN":"Любой банк BYN","WIREKZT":"Любой банк KZT","WIREGEL":"Любой банк GEL","WIREGBP":"Любой банк GBP","WIRECNY":"Любой банк CNY","WIRETRY":"Любой банк TRY","WIREPLN":"Любой банк PLN","WIRETHB":"Любой банк THB","WIREINR":"Любой банк INR","WIRENGN":"Любой банк NGN","WIREIDR":"Любой банк IDR","SEPAEUR":"Sepa EUR","ERIPBYN":"ЕРИП Расчет BYN","SBPRUB":"СБП RUB","STLMRUB":"Счет ИП или ООО RUB","REVBUSD":"Revolut USD","REVBEUR":"Revolut EUR","WUUSD":"WU USD","WUEUR":"WU EUR","WURUB":"WU RUB","MGUSD":"MoneyGram USD","MGEUR":"MoneyGram EUR","CNTUSD":"Contact USD","CNTRUB":"Contact RUB","GCMTUSD":"ЗК USD","GCMTRUB":"ЗК RUB","USTMUSD":"UNI USD","USTMRUB":"UNI RUB","RMTFUSD":"Ria USD","RMTFEUR":"Ria EUR","CASHUSD":"Наличные USD","CASHRUB":"Наличные RUB","CASHEUR":"Наличные EUR","CASHUAH":"Наличные UAH","CASHBYN":"Наличные BYN","CASHKZT":"Наличные KZT","CASHGBP":"Наличные GBP","CASHAED":"Наличные AED","CASHTRY":"Наличные TRY"};

const RU_CURRENCY_NAME_BY_SYMBOL = {
    "BTC": "Биткоин (BTC)",
    "BTCLN": "Биткоин LN (BTC)",
    "BTCBEP20": "Биткоин BEP20 (BTC)",
    "BCH": "Биткоин кеш (BCH)",
    "BSV": "Биткоин SV (BSV)",
    "BTG": "Биткоин Голд (BTG)",
    "ETH": "Эфир (ETH)",
    "ETHBEP20": "Эфир BEP20 (ETH)",
    "WETH": "Wrapped ETH (WETH)",
    "ETC": "Эфир классик (ETC)",
    "LTC": "Лайткоин (LTC)",
    "XRP": "Рипл (XRP)",
    "XMR": "Монеро (XMR)",
    "DOGE": "Додж (DOGE)",
    "MATIC": "Полигон (MATIC)",
    "DASH": "Даш (DASH)",
    "ZEC": "Зеткеш (ZEC)",
    "USDTOMNI": "Tether Omni (USDT)", "USDTERC20": "Tether ERC20 (USDT)", "USDTTRC20": "Tether TRC20 (USDT)",
    "USDTBEP20": "Tether BEP20 (USDT)", "USDC": "USD Coin (USDC)", "TUSD": "TrueUSD (TUSD)",
    "USDP": "Pax Dollar (USDP)",
    "DAI": "Дай (DAI)",
    "BUSD": "Binance USD (BUSD)", "XEM": "NEM (XEM)", "REP": "Augur (REP)",
    "NEO": "Нео (NEO)", "EOS": "EOS (EOS)", "IOTA": "IOTA (MIOTA)",
    "LSK": "Lisk (LSK)", "ADA": "Cardano (ADA)",
    "XLM": "Стеллар (XLM)",
    "TRX": "ТРОН (TRX)",
    "WAVES": "Waves (WAVES)", "OMG": "OMG Network (OMG)",
    "XVG": "Verge (XVG)", "ZRX": "0x (ZRX)",
    "BNB": "Binance Coin (BNB)", "ICX": "ICON (ICX)",
    "KMD": "Комодо (KMD)",
    "BTT": "БитТоррент (BTT)",
    "BAT": "Бат (BAT)",
    "ONT": "Ontology (ONT)", "QTUM": "Qtum (QTUM)",
    "LINK": "Чейнлинк (LINK)",
    "ATOM": "Космос (ATOM)",
    "XTZ": "Tezos (XTZ)", "DOT": "Polkadot (DOT)", "UNI": "Uniswap (UNI)",
    "RVN": "Рейвкоин (RVN)",
    "SOL": "Solana (SOL)", "VET": "VeChain (VET)", "SHIB": "Shiba Inu (SHIB)",
    "ALGO": "Algorand (ALGO)", "MKR": "Maker (MKR)", "AVAX": "Avalanche (AVAX)",
    "YFI": "Yearn.finance (YFI)",
    "WMZ": "WMZ", "WMR": "WMR", "WMP": "WMP", "WME": "WME", "WMB": "WMB", "WMK": "WMK", "WMX": "WMX",
    "PMRUSD": "Paymer USD",
    "PMRRUB": "Paymer RUB", "PMUSD": "Perfect Money USD", "PMEUR": "Perfect Money EUR",
    "PMBTC": "Perfect Money BTC", "PMVUSD": "PM e-Voucher USD", "YAMRUB": "ЮMoney",
    "QWRUB": "QIWI RUB", "QWKZT": "QIWI KZT", "PPUSD": "PayPal USD",
    "PPRUB": "PayPal RUB", "PPEUR": "PayPal EUR", "PPGBP": "PayPal GBP",
    "ADVCUSD": "Advanced Cash USD", "ADVCRUB": "Advanced Cash RUB",
    "ADVCEUR": "Advanced Cash EUR", "ADVCUAH": "Advanced Cash UAH",
    "ADVCKZT": "Advanced Cash KZT", "ADVCTRY": "Advanced Cash TRY",
    "PRUSD": "Payeer USD", "PRRUB": "Payeer RUB", "PREUR": "Payeer EUR",
    "SKLUSD": "Skrill USD", "SKLEUR": "Skrill EUR", "IDAMD": "Idram",
    "PAXUMUSD": "Paxum",
    "CPTSUSD": "Capitalist USD",
    "CPTSRUB": "Capitalist RUB",
    "NTLRUSD": "Neteller USD", "NTLREUR": "Neteller EUR",
    "PSRUSD": "PaySera USD",
    "PSREUR": "PaySera EUR",
    "ECPZUSD": "ecoPayz",
    "NIXUSD": "NixMoney USD",
    "NIXEUR": "NixMoney EUR",
    "GMUAH": "Global24", "VLSPUSD": "VelesPay", "EPAYUSD": "Epay USD", "EPAYEUR": "Epay EUR",
    "ALPCNY": "Alipay",
    "PNRUSD": "Payoneer",
    "MWRUB": "Счет телефона RUB",
    "MWUAH": "Счет телефона UAH",
    "TRDUSD": "Криптобиржи USD",
    "TRDEUR": "Криптобиржи EUR",
    "EXMUSD": "Exmo USD", "EXMRUB": "Exmo RUB", "EXMUAH": "Exmo UAH", "EXMBTC": "Exmo BTC",
    "EXMUSDT": "Exmo USDT", "BNACRUB": "Binance RUB", "BNACUAH": "Binance UAH",
    "CRXUSD": "Cryptex", "KUNAUAH": "Kuna", "GRNTXRUB": "Garantex",
    "WHTBTUSD": "WhiteBIT",
    "SBERRUB": "Сбербанк",
    "SBERDRUB": "Сбербанк Код",
    "ACRUB": "Альфа-Банк",
    "ACCUSD": "Альфа cash-in USD",
    "ACCRUB": "Альфа cash-in RUB",
    "TCSBRUB": "Тинькофф",
    "TCSBCRUB": "Тинькофф cash-in",
    "TCSBQRUB": "Тинькофф QR",
    "TBRUB": "ВТБ",
    "RUSSTRUB": "Русский Стандарт", "AVBRUB": "Авангард",
    "PSBRUB": "Промсвязьбанк",
    "GPBRUB": "Газпромбанк",
    "KUKRUB": "Кукуруза",
    "RFBRUB": "Райффайзен",
    "RNKBRUB": "РНКБ",
    "OPNBRUB": "Открытие",
    "POSTBRUB": "Почта Банк",
    "RSHBRUB": "Россельхозбанк",
    "ROSBRUB": "Росбанк",
    "MTSBRUB": "МТС Банк",
    "HCBRUB": "Хоум Кредит",
    "P24USD": "Приват 24 USD",
    "P24UAH": "Приват 24 UAH",
    "RFBUAH": "Райффайзен UAH",
    "OSDBUAH": "Ощадбанк",
    "USBUAH": "УкрСиббанк",
    "PMBBUAH": "ПУМБ",
    "MONOBUAH": "Монобанк",
    "SBERUAH": "Сбербанк UAH",
    "ACUAH": "Альфа-Банк UAH",
    "BLRBBYN": "Беларусбанк",
    "HLKBKZT": "HalykBank",
    "SBERKZT": "Сбербанк KZT",
    "FRTBKZT": "ForteBank",
    "KSPBKZT": "Kaspi Bank",
    "JSNBKZT": "Jysan Bank",
    "CARDUSD": "Visa/MasterCard USD",
    "CARDRUB": "Visa/MasterCard RUB",
    "CARDEUR": "Visa/MasterCard EUR",
    "CARDUAH": "Visa/MasterCard UAH",
    "CARDBYN": "Visa/MasterCard BYN",
    "CARDKZT": "Visa/MasterCard KZT",
    "CARDSEK": "Visa/MasterCard SEK",
    "CARDPLN": "Visa/MasterCard PLN",
    "CARDMDL": "Visa/MasterCard MDL",
    "CARDAMD": "Visa/MasterCard AMD",
    "CARDGBP": "Visa/MasterCard GBP",
    "CARDCNY": "Visa/MasterCard CNY",
    "CARDTRY": "Visa/MasterCard TRY",
    "CARDKGS": "Visa/MasterCard KGS",
    "MIRCRUB": "Карта Мир",
    "UPCNY": "Карта UnionPay",
    "UZCUZS": "Карта UZCARD",
    "HUMOUZS": "Карта HUMO",
    "WIREUSD": "Любой банк USD",
    "WIRERUB": "Любой банк RUB",
    "WIREEUR": "Любой банк EUR",
    "WIREUAH": "Любой банк UAH",
    "WIREBYN": "Любой банк BYN",
    "WIREKZT": "Любой банк KZT",
    "WIREGEL": "Любой банк GEL",
    "WIREGBP": "Любой банк GBP",
    "WIRECNY": "Любой банк CNY",
    "WIRETRY": "Любой банк TRY",
    "WIREPLN": "Любой банк PLN",
    "WIRETHB": "Любой банк THB",
    "WIREINR": "Любой банк INR",
    "WIRENGN": "Любой банк NGN",
    "WIREIDR": "Любой банк IDR",
    "SEPAEUR": "Sepa EUR",
    "ERIPBYN": "ЕРИП Расчет",
    "SBPRUB": "СБП",
    "STLMRUB": "Счет ИП или ООО",
    "REVBUSD": "Revolut USD",
    "REVBEUR": "Revolut EUR",
    "WUUSD": "WU USD", "WUEUR": "WU EUR", "WURUB": "WU RUB",
    "MGUSD": "MoneyGram USD",
    "MGEUR": "MoneyGram EUR",
    "CNTUSD": "Contact USD", "CNTRUB": "Contact RUB",
    "GCMTUSD": "Золотая Корона USD", "GCMTRUB": "Золотая Корона RUB",
    "USTMUSD": "UNI USD", "USTMRUB": "UNI RUB",
    "RMTFUSD": "Ria USD", "RMTFEUR": "Ria EUR",
    "CASHUSD": "Наличные USD",
    "CASHRUB": "Наличные RUB",
    "CASHEUR": "Наличные EUR",
    "CASHUAH": "Наличные UAH",
    "CASHBYN": "Наличные BYN",
    "CASHKZT": "Наличные KZT",
    "CASHGBP": "Наличные GBP",
    "CASHAED": "Наличные AED",
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

function pairsToCurrenciesFrom(pairsTree, filterTo) {
    var lo = 'undefined' !== typeof _ ? _ : require('lodash'); // for SSR
    
    return lo.chain(pairsTree)
        .map((branch, from) => ({
            id: CURRENCY_ID_BY_SYMBOL[from],
            name: CURRENCY_NAME_BY_SYMBOL[from] || from,
            symbol: from,
            weight: filterTo ? (branch[filterTo] || 0) : lo.reduce(branch, (s, w) => s + w, 0),
        }))
        .sortBy('name')
        .sortBy(p => - p.weight)
        .value();
}

function pairsToCurrenciesTo(pairsTree, filterFrom) {
    var lo = 'undefined' !== typeof _ ? _ : require('lodash'); // for SSR
    
    const toAll = lo.chain(filterFrom ? pairsTree[filterFrom] ? [ pairsTree[filterFrom] ] : [] : pairsTree)
        .map(branch =>
            lo.map(branch, (w, to) => ({
                id: CURRENCY_ID_BY_SYMBOL[to],
                name: CURRENCY_NAME_BY_SYMBOL[to] || to,
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
        .sortBy('name')
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

// utils
function rateExchangerExchangeUrl(rate, exch) {
    const FROM = rate.from, TO = rate.to,
        tr = {
            FROM: FROM,
            from: FROM.toLowerCase(),
            TO: TO,
            to: TO.toLowerCase(),
            "from-full": "from-full ok",
            "to-full": "to-full ok",
            "rid": 'ANY_MORE_GET_PARAM_RID',
            'referral_code': 'ANY_TOO_REFERRAL_CODE',
        },
        unknown = [],
        url = exch.exUrlTmpl.replace(/\{([\w-]+)\}/g, (full, key) => tr[key] || unknown.push(key));
    
    if (unknown.length > 0)
        console.warn('rateExchangerExchangeUrl(', rate, exch, '): unknown parentesses {', unknown, '} in the url', url);
    
    return url;
}

function numberWithSpaces(x, fixed) {
    x = Number(x);
    fixed = Math.min(Math.max(fixed, 0), 8);
    
    let parts = (fixed ? x.toFixed(fixed) : x.toString()).split(".");
    
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.map(p => p).join(".");
    //return parts.map(p => p.replace(/\B(?=(\d{3})+(?!\d))/g, " ")).join(" .");
}

const currencyToName = Object.assign(
    (symbol, options) => {
        options = Object.assign({}, currencyToName.defaults, options);
        
        let result = ('ru' === options.locale) && RU_CURRENCY_NAME_BY_SYMBOL[symbol];
        
        return result || CURRENCY_NAME_BY_SYMBOL[symbol] || symbol;
    }, {
        defaults: {
            locale: 'en',
        }
    }
);
        
const 
    EXDIR_GROUPS = [
        {"id": 1, order: Infinity, "Name":"Электронные деньги"},
        {"id": 2, order: Infinity, "Name":"Балансы криптобирж"},
        {"id": 3, order: 3, "Name":"Интернет-банкинг"},
        {"id": 4, order: Infinity, "Name":"Денежные переводы"},
        {"id": 5, order: 2, "Name":"Наличные деньги"},
        {"id": "M777A2", order: 1, "Name":"Криптовалюта"},
    ],
    EXDIRS = [{"id":93,"symbol":"BTC","dashed":"bitcoin","Name":"Bitcoin","Short":"Bitcoin","gid":null},{"id":131,"symbol":"BTC","dashed":"bitcoin-ln","Name":"Bitcoin ln","Short":"Bitcoin LN","gid":null},{"id":43,"symbol":"BTCB","dashed":"bitcoin-bep20","Name":"Bitcoin bep20","Short":"Bitcoin BEP20","gid":null},{"id":73,"symbol":"WBTC","dashed":"wrapped-bitcoin","Name":"Wrapped bitcoin","Short":"Wrapped BTC","gid":null},{"id":172,"symbol":"BCH","dashed":"bitcoin-cash","Name":"Bitcoin cash","Short":"Bitcoin Cash","gid":null},{"id":137,"symbol":"BSV","dashed":"bitcoin-sv","Name":"Bitcoin sv","Short":"Bitcoin SV","gid":null},{"id":184,"symbol":"BTG","dashed":"bitcoin-gold","Name":"Bitcoin gold","Short":"Bitcoin Gold","gid":null},{"id":139,"symbol":"ETH","dashed":"ethereum","Name":"Ethereum","Short":"Ethereum","gid":null},{"id":212,"symbol":"ETH","dashed":"ethereum-bep20","Name":"Ethereum bep20","Short":"Ethereum BEP20","gid":null},{"id":218,"symbol":"WETH","dashed":"wrapped-eth","Name":"Wrapped eth","Short":"Wrapped ETH","gid":null},{"id":160,"symbol":"ETC","dashed":"ethereum-classic","Name":"Ethereum classic","Short":"Ether Classic","gid":null},{"id":99,"symbol":"LTC","dashed":"litecoin","Name":"Litecoin","Short":"Litecoin","gid":null},{"id":161,"symbol":"XRP","dashed":"ripple","Name":"Ripple","Short":"Ripple","gid":null},{"id":149,"symbol":"XMR","dashed":"monero","Name":"Monero","Short":"Monero","gid":null},{"id":115,"symbol":"DOGE","dashed":"dogecoin","Name":"Dogecoin","Short":"Dogecoin","gid":null},{"id":138,"symbol":"MATIC","dashed":"polygon","Name":"Polygon","Short":"Polygon","gid":null},{"id":140,"symbol":"DASH","dashed":"dash","Name":"Dash","Short":"Dash","gid":null},{"id":162,"symbol":"ZEC","dashed":"zcash","Name":"Zcash","Short":"Zcash","gid":null},{"id":163,"symbol":"USDT","dashed":"tether","Name":"Tether","Short":"Tether Omni","gid":null},{"id":36,"symbol":"USDT","dashed":"tether-erc20","Name":"Tether erc20","Short":"Tether ERC20","gid":null},{"id":10,"symbol":"USDT","dashed":"tether-trc20","Name":"Tether trc20","Short":"Tether TRC20","gid":null},{"id":208,"symbol":"USDT","dashed":"tether-bep20","Name":"Tether bep20","Short":"Tether BEP20","gid":null},{"id":180,"symbol":"USDT","dashed":"tether-sol","Name":"Tether sol","Short":"Tether SOL","gid":null},{"id":23,"symbol":"USDC","dashed":"usd-coin","Name":"Usd coin","Short":"USDCoin ERC20","gid":null},{"id":110,"symbol":"USDC","dashed":"usd-coin-trc20","Name":"Usd coin trc20","Short":"USDCoin TRC20","gid":null},{"id":24,"symbol":"TUSD","dashed":"trueusd","Name":"Trueusd","Short":"TrueUSD","gid":null},{"id":189,"symbol":"USDP","dashed":"pax-dollar","Name":"Pax dollar","Short":"Pax Dollar","gid":null},{"id":203,"symbol":"DAI","dashed":"dai","Name":"Dai","Short":"Dai","gid":null},{"id":206,"symbol":"BUSD","dashed":"busd","Name":"BUSD","Short":"Binance USD","gid":null},{"id":174,"symbol":"UST","dashed":"terrausd","Name":"Terrausd","Short":"TerraUSD","gid":null},{"id":173,"symbol":"XEM","dashed":"nem","Name":"Nem","Short":"NEM","gid":null},{"id":177,"symbol":"NEO","dashed":"neo","Name":"Neo","Short":"NEO","gid":null},{"id":178,"symbol":"EOS","dashed":"eos","Name":"Eos","Short":"EOS","gid":null},{"id":179,"symbol":"MIOTA","dashed":"iota","Name":"Iota","Short":"IOTA","gid":null},{"id":181,"symbol":"ADA","dashed":"cardano","Name":"Cardano","Short":"Cardano","gid":null},{"id":182,"symbol":"XLM","dashed":"stellar","Name":"Stellar","Short":"Stellar","gid":null},{"id":185,"symbol":"TRX","dashed":"tron","Name":"Tron","Short":"TRON","gid":null},{"id":133,"symbol":"WAVES","dashed":"waves","Name":"Waves","Short":"Waves","gid":null},{"id":48,"symbol":"OMG","dashed":"omg","Name":"Omg","Short":"OMG Network","gid":null},{"id":124,"symbol":"XVG","dashed":"verge","Name":"Verge","Short":"Verge","gid":null},{"id":168,"symbol":"ZRX","dashed":"zrx","Name":"Zrx","Short":"0x","gid":null},{"id":19,"symbol":"BNB","dashed":"binance-coin","Name":"Binance coin","Short":"Binance Coin","gid":null},{"id":104,"symbol":"ICX","dashed":"icon","Name":"Icon","Short":"ICON","gid":null},{"id":134,"symbol":"KMD","dashed":"komodo","Name":"Komodo","Short":"Komodo","gid":null},{"id":27,"symbol":"BTTC","dashed":"bittorrent","Name":"Bittorrent","Short":"BitTorrent","gid":null},{"id":61,"symbol":"BAT","dashed":"bat","Name":"Bat","Short":"BAT","gid":null},{"id":135,"symbol":"ONT","dashed":"ontology","Name":"Ontology","Short":"Ontology","gid":null},{"id":26,"symbol":"QTUM","dashed":"qtum","Name":"Qtum","Short":"Qtum","gid":null},{"id":197,"symbol":"LINK","dashed":"chainlink","Name":"Chainlink","Short":"Chainlink","gid":null},{"id":198,"symbol":"ATOM","dashed":"cosmos","Name":"Cosmos","Short":"Cosmos","gid":null},{"id":175,"symbol":"XTZ","dashed":"tezos","Name":"Tezos","Short":"Tezos","gid":null},{"id":201,"symbol":"DOT","dashed":"polkadot","Name":"Polkadot","Short":"Polkadot","gid":null},{"id":202,"symbol":"UNI","dashed":"uniswap","Name":"Uniswap","Short":"Uniswap","gid":null},{"id":205,"symbol":"RVN","dashed":"ravencoin","Name":"Ravencoin","Short":"Ravencoin","gid":null},{"id":82,"symbol":"SOL","dashed":"solana","Name":"Solana","Short":"Solana","gid":null},{"id":8,"symbol":"VET","dashed":"vechain","Name":"Vechain","Short":"VeChain","gid":null},{"id":210,"symbol":"SHIB","dashed":"shiba-inu","Name":"Shiba inu","Short":"Shiba ERC20","gid":null},{"id":32,"symbol":"SHIB","dashed":"shiba-inu-bep20","Name":"Shiba inu bep20","Short":"Shiba BEP20","gid":null},{"id":216,"symbol":"ALGO","dashed":"algorand","Name":"Algorand","Short":"Algorand","gid":null},{"id":213,"symbol":"MKR","dashed":"maker","Name":"Maker","Short":"Maker","gid":null},{"id":217,"symbol":"AVAX","dashed":"avalanche","Name":"Avalanche","Short":"Avalanche","gid":null},{"id":220,"symbol":"YFI","dashed":"yearn-finance","Name":"Yearn finance","Short":"Yearn.finance","gid":null},{"id":227,"symbol":"MANA","dashed":"decentraland","Name":"Decentraland","Short":"Decentraland","gid":null},{"id":2,"symbol":"LUNA","dashed":"terra","Name":"Terra","Short":"Terra","gid":null},{"id":76,"symbol":"NEAR","dashed":"near","Name":"Near","Short":"NEAR Protocol","gid":null},{"id":144,"symbol":"CRO","dashed":"cronos","Name":"Cronos","Short":"Cronos","gid":null},{"id":209,"symbol":"TON","dashed":"ton","Name":"Ton","Short":"Toncoin","gid":null},{"id":1,"symbol":"WMZ","dashed":"wmz","Name":"Wmz","Short":"WebMoney","gid":1},{"id":3,"symbol":"WME","dashed":"wme","Name":"Wme","Short":"WebMoney","gid":1},{"id":47,"symbol":"WMK","dashed":"wmk","Name":"Wmk","Short":"WebMoney","gid":1},{"id":96,"symbol":"WMX","dashed":"wmx","Name":"Wmx","Short":"WebMoney","gid":1},{"id":87,"symbol":"USD","dashed":"paymer","Name":"Paymer","Short":"Paymer","gid":1},{"id":40,"symbol":"USD","dashed":"perfectmoney-usd","Name":"Perfectmoney USD","Short":"Perfect Money","gid":1},{"id":41,"symbol":"EUR","dashed":"perfectmoney-eur","Name":"Perfectmoney EUR","Short":"Perfect Money","gid":1},{"id":128,"symbol":"BTC","dashed":"perfectmoney-btc","Name":"Perfectmoney btc","Short":"Perfect Money","gid":1},{"id":156,"symbol":"USD","dashed":"pm-voucher","Name":"Pm voucher","Short":"PM e-Voucher","gid":1},{"id":6,"symbol":"RUB","dashed":"yoomoney","Name":"Yoomoney","Short":"ЮMoney","gid":1},{"id":63,"symbol":"RUB","dashed":"qiwi","Name":"Qiwi","Short":"QIWI","gid":1},{"id":127,"symbol":"KZT","dashed":"qiwi-kzt","Name":"Qiwi kzt","Short":"QIWI","gid":1},{"id":45,"symbol":"USD","dashed":"paypal-usd","Name":"Paypal USD","Short":"PayPal","gid":1},{"id":98,"symbol":"RUB","dashed":"paypal-rub","Name":"Paypal RUB","Short":"PayPal","gid":1},{"id":80,"symbol":"EUR","dashed":"paypal-euro","Name":"Paypal EURO","Short":"PayPal","gid":1},{"id":164,"symbol":"GBP","dashed":"paypal-gbp","Name":"Paypal gbp","Short":"PayPal","gid":1},{"id":88,"symbol":"USD","dashed":"advanced-cash","Name":"Advanced cash","Short":"Advanced Cash","gid":1},{"id":121,"symbol":"RUB","dashed":"advanced-cash-rub","Name":"Advanced cash RUB","Short":"Advanced Cash","gid":1},{"id":120,"symbol":"EUR","dashed":"advanced-cash-euro","Name":"Advanced cash EURO","Short":"Advanced Cash","gid":1},{"id":142,"symbol":"UAH","dashed":"advanced-cash-uah","Name":"Advanced cash uah","Short":"Advanced Cash","gid":1},{"id":33,"symbol":"KZT","dashed":"advanced-cash-kzt","Name":"Advanced cash kzt","Short":"Advanced Cash","gid":1},{"id":20,"symbol":"TRY","dashed":"advanced-cash-try","Name":"Advanced cash try","Short":"Advanced Cash","gid":1},{"id":108,"symbol":"USD","dashed":"payeer","Name":"Payeer","Short":"Payeer","gid":1},{"id":117,"symbol":"RUB","dashed":"payeer-rub","Name":"Payeer RUB","Short":"Payeer","gid":1},{"id":122,"symbol":"EUR","dashed":"payeer-euro","Name":"Payeer EURO","Short":"Payeer","gid":1},{"id":44,"symbol":"USD","dashed":"skrill","Name":"Skrill","Short":"Skrill","gid":1},{"id":123,"symbol":"EUR","dashed":"skrill-euro","Name":"Skrill EURO","Short":"Skrill","gid":1},{"id":11,"symbol":"AMD","dashed":"idram","Name":"Idram","Short":"Idram","gid":1},{"id":74,"symbol":"USD","dashed":"paxum","Name":"Paxum","Short":"Paxum","gid":1},{"id":145,"symbol":"USD","dashed":"capitalist","Name":"Capitalist","Short":"Capitalist","gid":1},{"id":226,"symbol":"EUR","dashed":"capitalist-euro","Name":"Capitalist EURO","Short":"Capitalist","gid":1},{"id":85,"symbol":"RUB","dashed":"capitalist-rub","Name":"Capitalist RUB","Short":"Capitalist","gid":1},{"id":72,"symbol":"USD","dashed":"neteller","Name":"Neteller","Short":"Neteller","gid":1},{"id":136,"symbol":"EUR","dashed":"neteller-euro","Name":"Neteller EURO","Short":"Neteller","gid":1},{"id":152,"symbol":"USD","dashed":"paysera","Name":"Paysera","Short":"PaySera","gid":1},{"id":35,"symbol":"EUR","dashed":"paysera-euro","Name":"Paysera EURO","Short":"PaySera","gid":1},{"id":200,"symbol":"USD","dashed":"ecopayz","Name":"Ecopayz","Short":"ecoPayz","gid":1},{"id":109,"symbol":"USD","dashed":"nixmoney","Name":"Nixmoney","Short":"NixMoney","gid":1},{"id":125,"symbol":"EUR","dashed":"nixmoney-euro","Name":"Nixmoney EURO","Short":"NixMoney","gid":1},{"id":112,"symbol":"UAH","dashed":"global24","Name":"Global24","Short":"Global24","gid":1},{"id":154,"symbol":"USD","dashed":"epay","Name":"Epay","Short":"Epay","gid":1},{"id":97,"symbol":"EUR","dashed":"epay-euro","Name":"Epay EURO","Short":"Epay","gid":1},{"id":165,"symbol":"CNY","dashed":"alipay","Name":"Alipay","Short":"Alipay","gid":1},{"id":103,"symbol":"USD","dashed":"payoneer","Name":"Payoneer","Short":"Payoneer","gid":1},{"id":49,"symbol":"RUB","dashed":"mobile-wallet-rub","Name":"Mobile wallet RUB","Short":"Счет телефона","gid":1},{"id":12,"symbol":"UAH","dashed":"mobile-wallet-uah","Name":"Mobile wallet uah","Short":"Счет телефона","gid":1},{"id":148,"symbol":"USD","dashed":"trade-usd","Name":"Trade USD","Short":"Криптобиржи","gid":1},{"id":153,"symbol":"EUR","dashed":"trade-euro","Name":"Trade EURO","Short":"Криптобиржи","gid":1},{"id":129,"symbol":"USD","dashed":"exmo","Name":"Exmo","Short":"Exmo","gid":2},{"id":130,"symbol":"RUB","dashed":"exmo-rub","Name":"Exmo RUB","Short":"Exmo","gid":2},{"id":169,"symbol":"UAH","dashed":"exmo-uah","Name":"Exmo uah","Short":"Exmo","gid":2},{"id":186,"symbol":"BTC","dashed":"exmo-btc","Name":"Exmo btc","Short":"Exmo","gid":2},{"id":50,"symbol":"USDT","dashed":"exmo-tether","Name":"Exmo tether","Short":"Exmo","gid":2},{"id":126,"symbol":"RUB","dashed":"binance-rub","Name":"Binance RUB","Short":"Binance","gid":2},{"id":190,"symbol":"USD","dashed":"cryptex","Name":"Cryptex","Short":"Cryptex","gid":2},{"id":28,"symbol":"UAH","dashed":"kuna","Name":"Kuna","Short":"Kuna","gid":2},{"id":16,"symbol":"RUB","dashed":"garantex","Name":"Garantex","Short":"Garantex","gid":2},{"id":214,"symbol":"USD","dashed":"whitebit","Name":"Whitebit","Short":"WhiteBIT","gid":2},{"id":42,"symbol":"RUB","dashed":"sberbank","Name":"Sberbank","Short":"Сбербанк","gid":3},{"id":52,"symbol":"RUB","dashed":"alfaclick","Name":"Alfaclick","Short":"Альфа-Банк","gid":3},{"id":143,"symbol":"USD","dashed":"alfabank-cashin-usd","Name":"Alfabank cashin USD","Short":"Альфа cash-in","gid":3},{"id":62,"symbol":"RUB","dashed":"alfabank-cash-in","Name":"Alfabank cash in","Short":"Альфа cash-in","gid":3},{"id":105,"symbol":"RUB","dashed":"tinkoff","Name":"Tinkoff","Short":"Тинькофф","gid":3},{"id":46,"symbol":"RUB","dashed":"tinkoff-cash-in","Name":"Tinkoff cash in","Short":"Тинькофф cash-in","gid":3},{"id":147,"symbol":"RUB","dashed":"tinkoff-qr-codes","Name":"Tinkoff qr codes","Short":"Тинькофф QR","gid":3},{"id":51,"symbol":"RUB","dashed":"vtb","Name":"Vtb","Short":"ВТБ","gid":3},{"id":64,"symbol":"RUB","dashed":"russtandart","Name":"Russtandart","Short":"Русский Стандарт","gid":3},{"id":79,"symbol":"RUB","dashed":"avangard","Name":"Avangard","Short":"Авангард","gid":3},{"id":53,"symbol":"RUB","dashed":"psbank","Name":"Psbank","Short":"Промсвязьбанк","gid":3},{"id":95,"symbol":"RUB","dashed":"gazprombank","Name":"Gazprombank","Short":"Газпромбанк","gid":3},{"id":57,"symbol":"RUB","dashed":"kykyryza","Name":"Kykyryza","Short":"Кукуруза","gid":3},{"id":157,"symbol":"RUB","dashed":"raiffeisen-bank","Name":"Raiffeisen bank","Short":"Райффайзен","gid":3},{"id":132,"symbol":"RUB","dashed":"rnkb","Name":"Rnkb","Short":"РНКБ","gid":3},{"id":176,"symbol":"RUB","dashed":"openbank","Name":"Openbank","Short":"Открытие","gid":3},{"id":170,"symbol":"RUB","dashed":"post-bank","Name":"Post bank","Short":"Почта Банк","gid":3},{"id":34,"symbol":"RUB","dashed":"rosselhozbank","Name":"Rosselhozbank","Short":"Россельхозбанк","gid":3},{"id":195,"symbol":"RUB","dashed":"rosbank","Name":"Rosbank","Short":"Росбанк","gid":3},{"id":191,"symbol":"RUB","dashed":"mts-bank","Name":"Mts bank","Short":"МТС Банк","gid":3},{"id":215,"symbol":"RUB","dashed":"homecredit","Name":"Homecredit","Short":"Хоум Кредит","gid":3},{"id":55,"symbol":"USD","dashed":"privat24-usd","Name":"Privat24 USD","Short":"Приват 24","gid":3},{"id":56,"symbol":"UAH","dashed":"privat24-uah","Name":"Privat24 uah","Short":"Приват 24","gid":3},{"id":158,"symbol":"UAH","dashed":"raiffeisen-bank-uah","Name":"Raiffeisen bank uah","Short":"Райффайзен","gid":3},{"id":68,"symbol":"UAH","dashed":"oschadbank","Name":"Oschadbank","Short":"Ощадбанк","gid":3},{"id":22,"symbol":"UAH","dashed":"ukrsibbank","Name":"Ukrsibbank","Short":"УкрСиббанк","gid":3},{"id":118,"symbol":"UAH","dashed":"pumb","Name":"Pumb","Short":"ПУМБ","gid":3},{"id":84,"symbol":"UAH","dashed":"monobank","Name":"Monobank","Short":"Монобанк","gid":3},{"id":196,"symbol":"UAH","dashed":"sberbank-uah","Name":"Sberbank uah","Short":"Сбербанк","gid":3},{"id":37,"symbol":"UAH","dashed":"alfabank-uah","Name":"Alfabank uah","Short":"Альфа-Банк","gid":3},{"id":4,"symbol":"BYN","dashed":"belarusbank","Name":"Belarusbank","Short":"Беларусбанк","gid":3},{"id":90,"symbol":"KZT","dashed":"halykbank","Name":"Halykbank","Short":"HalykBank","gid":3},{"id":114,"symbol":"KZT","dashed":"sberbank-kzt","Name":"Sberbank kzt","Short":"Сбербанк","gid":3},{"id":75,"symbol":"KZT","dashed":"fortebank","Name":"Fortebank","Short":"ForteBank","gid":3},{"id":66,"symbol":"KZT","dashed":"kaspi-bank","Name":"Kaspi bank","Short":"Kaspi Bank","gid":3},{"id":207,"symbol":"KZT","dashed":"jysan-bank","Name":"Jysan bank","Short":"Jysan Bank","gid":3},{"id":58,"symbol":"USD","dashed":"visa-mastercard-usd","Name":"Visa mastercard USD","Short":"Visa/MasterCard","gid":3},{"id":59,"symbol":"RUB","dashed":"visa-mastercard-rub","Name":"Visa mastercard RUB","Short":"Visa/MasterCard","gid":3},{"id":65,"symbol":"EUR","dashed":"visa-mastercard-euro","Name":"Visa mastercard EURO","Short":"Visa/MasterCard","gid":3},{"id":60,"symbol":"UAH","dashed":"visa-mastercard-uah","Name":"Visa mastercard uah","Short":"Visa/MasterCard","gid":3},{"id":54,"symbol":"BYN","dashed":"visa-mastercard-byr","Name":"Visa mastercard byr","Short":"Visa/MasterCard","gid":3},{"id":111,"symbol":"KZT","dashed":"visa-mastercard-kzt","Name":"Visa mastercard kzt","Short":"Visa/MasterCard","gid":3},{"id":155,"symbol":"SEK","dashed":"visa-mastercard-sek","Name":"Visa mastercard sek","Short":"Visa/MasterCard","gid":3},{"id":38,"symbol":"PLN","dashed":"visa-mastercard-pln","Name":"Visa mastercard pln","Short":"Visa/MasterCard","gid":3},{"id":194,"symbol":"MDL","dashed":"visa-mastercard-mdl","Name":"Visa mastercard mdl","Short":"Visa/MasterCard","gid":3},{"id":5,"symbol":"AMD","dashed":"visa-mastercard-amd","Name":"Visa mastercard amd","Short":"Visa/MasterCard","gid":3},{"id":146,"symbol":"GBP","dashed":"visa-mastercard-gbp","Name":"Visa mastercard gbp","Short":"Visa/MasterCard","gid":3},{"id":30,"symbol":"CNY","dashed":"visa-mastercard-cny","Name":"Visa mastercard cny","Short":"Visa/MasterCard","gid":3},{"id":83,"symbol":"TRY","dashed":"visa-mastercard-try","Name":"Visa mastercard try","Short":"Visa/MasterCard","gid":3},{"id":25,"symbol":"KGS","dashed":"visa-mastercard-kgs","Name":"Visa mastercard kgs","Short":"Visa/MasterCard","gid":3},{"id":221,"symbol":"CAD","dashed":"visa-mastercard-cad","Name":"Visa mastercard cad","Short":"Visa/MasterCard","gid":3},{"id":222,"symbol":"BGN","dashed":"visa-mastercard-bgn","Name":"Visa mastercard bgn","Short":"Visa/MasterCard","gid":3},{"id":223,"symbol":"HUF","dashed":"visa-mastercard-huf","Name":"Visa mastercard huf","Short":"Visa/MasterCard","gid":3},{"id":224,"symbol":"CZK","dashed":"visa-mastercard-czk","Name":"Visa mastercard czk","Short":"Visa/MasterCard","gid":3},{"id":225,"symbol":"NOK","dashed":"visa-mastercard-nok","Name":"Visa mastercard nok","Short":"Visa/MasterCard","gid":3},{"id":17,"symbol":"RUB","dashed":"mir","Name":"Mir","Short":"Карта Мир","gid":3},{"id":100,"symbol":"CNY","dashed":"unionpay","Name":"Unionpay","Short":"Карта UnionPay","gid":3},{"id":9,"symbol":"UZS","dashed":"uscard","Name":"Uscard","Short":"Карта UZCARD","gid":3},{"id":199,"symbol":"UZS","dashed":"humo","Name":"Humo","Short":"Карта HUMO","gid":3},{"id":69,"symbol":"USD","dashed":"wire-usd","Name":"Wire USD","Short":"Любой банк","gid":3},{"id":71,"symbol":"RUB","dashed":"wire-rub","Name":"Wire RUB","Short":"Любой банк","gid":3},{"id":70,"symbol":"EUR","dashed":"wire-euro","Name":"Wire EURO","Short":"Любой банк","gid":3},{"id":102,"symbol":"UAH","dashed":"wire-uah","Name":"Wire uah","Short":"Любой банк","gid":3},{"id":31,"symbol":"BYN","dashed":"wire-byn","Name":"Wire byn","Short":"Любой банк","gid":3},{"id":113,"symbol":"KZT","dashed":"wire-kzt","Name":"Wire kzt","Short":"Любой банк","gid":3},{"id":219,"symbol":"GEL","dashed":"wire-gel","Name":"Wire gel","Short":"Любой банк","gid":3},{"id":81,"symbol":"GBP","dashed":"wire-gbp","Name":"Wire gbp","Short":"Любой банк","gid":3},{"id":166,"symbol":"CNY","dashed":"wire-cny","Name":"Wire cny","Short":"Любой банк","gid":3},{"id":39,"symbol":"TRY","dashed":"wire-try","Name":"Wire try","Short":"Любой банк","gid":3},{"id":29,"symbol":"PLN","dashed":"wire-pln","Name":"Wire pln","Short":"Любой банк","gid":3},{"id":167,"symbol":"THB","dashed":"wire-thb","Name":"Wire thb","Short":"Любой банк","gid":3},{"id":119,"symbol":"INR","dashed":"wire-inr","Name":"Wire inr","Short":"Любой банк","gid":3},{"id":188,"symbol":"NGN","dashed":"wire-ngn","Name":"Wire ngn","Short":"Любой банк","gid":3},{"id":183,"symbol":"IDR","dashed":"wire-idr","Name":"Wire idr","Short":"Любой банк","gid":3},{"id":171,"symbol":"EUR","dashed":"sepa","Name":"Sepa","Short":"Sepa","gid":3},{"id":187,"symbol":"BYN","dashed":"erip","Name":"Erip","Short":"ЕРИП Расчет","gid":3},{"id":21,"symbol":"RUB","dashed":"sbp","Name":"Sbp","Short":"СБП","gid":3},{"id":159,"symbol":"RUB","dashed":"settlement-rub","Name":"Settlement RUB","Short":"Счет ИП или ООО","gid":3},{"id":192,"symbol":"USD","dashed":"revolut-usd","Name":"Revolut USD","Short":"Revolut","gid":3},{"id":193,"symbol":"EUR","dashed":"revolut-euro","Name":"Revolut EURO","Short":"Revolut","gid":3},{"id":67,"symbol":"USD","dashed":"wu","Name":"Wu","Short":"WU","gid":4},{"id":15,"symbol":"EUR","dashed":"wu-euro","Name":"Wu EURO","Short":"WU","gid":4},{"id":7,"symbol":"RUB","dashed":"wu-rub","Name":"Wu RUB","Short":"WU","gid":4},{"id":78,"symbol":"USD","dashed":"moneygram","Name":"Moneygram","Short":"MoneyGram","gid":4},{"id":77,"symbol":"EUR","dashed":"moneygram-euro","Name":"Moneygram EURO","Short":"MoneyGram","gid":4},{"id":101,"symbol":"USD","dashed":"contact-usd","Name":"Contact USD","Short":"Contact","gid":4},{"id":106,"symbol":"RUB","dashed":"contact","Name":"Contact","Short":"Contact","gid":4},{"id":116,"symbol":"USD","dashed":"golden-crown-usd","Name":"Golden crown USD","Short":"ЗК","gid":4},{"id":107,"symbol":"RUB","dashed":"golden-crown","Name":"Golden crown","Short":"ЗК","gid":4},{"id":86,"symbol":"USD","dashed":"uni","Name":"Uni","Short":"UNI","gid":4},{"id":14,"symbol":"RUB","dashed":"uni-rub","Name":"Uni RUB","Short":"UNI","gid":4},{"id":150,"symbol":"USD","dashed":"ria-usd","Name":"Ria USD","Short":"Ria","gid":4},{"id":151,"symbol":"EUR","dashed":"ria-euro","Name":"Ria EURO","Short":"Ria","gid":4},{"id":89,"symbol":"USD","dashed":"dollar-cash","Name":"Dollar cash","Short":"Наличные","gid":5},{"id":91,"symbol":"RUB","dashed":"ruble-cash","Name":"Ruble cash","Short":"Наличные","gid":5},{"id":141,"symbol":"EUR","dashed":"euro-cash","Name":"Euro cash","Short":"Наличные","gid":5},{"id":92,"symbol":"UAH","dashed":"hryvnia-cash","Name":"Hryvnia cash","Short":"Наличные","gid":5},{"id":13,"symbol":"BYN","dashed":"belarus-cash","Name":"Belarus cash","Short":"Наличные","gid":5},{"id":94,"symbol":"KZT","dashed":"tenge-cash","Name":"Tenge cash","Short":"Наличные","gid":5},{"id":204,"symbol":"GBP","dashed":"pound-cash","Name":"Pound cash","Short":"Наличные","gid":5},{"id":211,"symbol":"AED","dashed":"dirham","Name":"Dirham","Short":"Наличные","gid":5},{"id":18,"symbol":"TRY","dashed":"turkish-cash","Name":"Turkish cash","Short":"Наличные","gid":5}];

/** Enreachment of old CURRENCIES <--and--> new EXDIRS
 */
const
    clearName = (name, symbol, strict) => {
        name = name.replace(new RegExp('\\s*\\(?' + symbol + '\\)?$'), '').replace(/\s*\(\w+\)$/, '');
        if (strict === false) {
            name = name.replace(/(\S)\s+\w+$/, '$1');
        }
        name = name .replace(/[\-\s\)\(]/g, '').toLowerCase();
        return name;
    },
    findCurrencyGroupId = (cu) => {
        //console.log('find...', cu.name, cu.symbol, '=>', clearName(cu.name, cu.symbol));
        let exd;
        
        // Name
        cu.name = CURRENCY_NAME_BY_SYMBOL[cu.symbol] || cu.name;
        trying('Name',               clearName(cu.name, cu.symbol),         exd => clearName(exd.Name, exd.SIGN || exd.symbol));
        trying('Name, not strict',   clearName(cu.name, cu.symbol, false),  exd => clearName(exd.Name, exd.SIGN || exd.symbol, false));
    
        // ru
        cu.Название = RU_CURRENCY_NAME_BY_SYMBOL[cu.symbol] || cu.name;
        trying('Name, ru',                clearName(cu.Название, cu.symbol),         exd => clearName(exd.Name, exd.SIGN || exd.symbol));
        trying('Name, ru, not strict',    clearName(cu.Название, cu.symbol, false),  exd => clearName(exd.Name, exd.SIGN || exd.symbol, false));
    
        // Short
        trying('Short',              clearName(cu.name, cu.symbol),         exd => clearName(exd.Short, exd.SIGN || exd.symbol));
        trying('Short, not strict',  clearName(cu.name, cu.symbol, false),  exd => clearName(exd.Short, exd.SIGN || exd.symbol, false));
        
        trying('Short, ru',               clearName(cu.Название, cu.symbol),         exd => clearName(exd.Short, exd.SIGN || exd.symbol));
        trying('Short, ru, not strict',   clearName(cu.Название, cu.symbol, false),  exd => clearName(exd.Short, exd.SIGN || exd.symbol, false));
    
        let gid = exd && exd.gid;
        if (gid === null) gid = 'M777A2';
        
        if (gid) {
            cu.gid = gid;
        }
    
        if (exd) {
            cu.id = exd.id;
            exd.SIGN = cu.symbol;
        }
        else {
            //console.error('group not found by', exd);
        }
    
        function trying(condName, nameText, exd2text) {
            if (exd && exd.gid || exd && exd.gid === null) return;
                
            exd = _.filter(EXDIRS, exd => nameText === exd2text(exd));
            
            if (!exd.length) {
                //console.warn(nameText, cu.symbol, '[', condName, '] not found');
                exd = NaN;
            }
            else if (exd.length > 1) {
                //console.warn(nameText, cu.symbol, '[', condName, '] found > 1', exd.map(exd => clearName(exd.Name, exd.symbol)));
                exd = NaN;
            }
            else {
                exd = exd[0];
                //console.log(nameText, cu.symbol, 'found', exd);
            }
        }
        
        return gid;
    },
    groupUnionCurrenciesByGroup = (currencies) => {
        return _.chain(currencies)
            .groupBy(findCurrencyGroupId)
            .map((members, gid) => {
                const group = _.findWhere(EXDIR_GROUPS, { id: Number(gid) || gid });
                return [{
                    group: group || { Name: 'Иное' }
                }].concat(members);
            })
            .sortBy(g => g[0].order)
            .flatten()
            .value();
    };

if (typeof PAIRS !== 'undefined') { // front only
    console.log('Currencies FROM with gid:', _.groupBy(pairsToCurrenciesFrom(PAIRS()), findCurrencyGroupId));
    console.log('Currencies TO with gid:', _.groupBy(pairsToCurrenciesTo(PAIRS()), findCurrencyGroupId));
}

// module.exports for SSR   
if (typeof module !== 'undefined') {
    module.exports = {
        CURRENCY_NAME_BY_SYMBOL,
        CURRENCY_ID_BY_SYMBOL,
        CURRENCY_SYMBOL_BY_ID,
        CURRENCY_IDS,
        FLAG_BY_SYMBOL,
        //CURRENCY_ANY_LIST,
        
        EXDIR_GROUPS,
        EXDIRS,

        pairsToCurrenciesFrom,
        pairsToCurrenciesTo,
        
        // utils
        rateExchangerExchangeUrl,
        numberWithSpaces,
        
        currencyToName,
    };
}
