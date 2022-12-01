export const LANGS = ['ru', 'pl', 'en']; // need to add lang maps
export const DEFAULT_LANG = LANGS[0];
export const LANG_REGEX = LANGS
    .slice(1)
    .join('|');
export const DEFAULT_LANG_ROUTE = '';
export const SCROLL_TOP_LOCKED_EVENT_NAME = 'SCROLL_TOP_LOCKED_EVENT_NAME';
export const COOKIE_AGREEMENT_NAME = 'pl-finance-cookies-agreement';
export const TOKEN_CLIENT_LOCAL_STORAGE_NAME = 'pl-finance-client-token';
// export const TOKEN_LOCAL_STORAGE_NAME = 'pl-finance-token';

export const INITIAL_BALANCE = 5000;
export const COMMISSION = 0.0125;

export const CHART_TYPES = [
    { id: 1, name: 'Candlesticks', value: 'candlesticks' },
    { id: 2, name: 'Heikinashi', value: 'heikinashi' },
    { id: 3, name: 'HLC', value: 'hlc' },
    { id: 4, name: 'Line', value: 'line' },
    { id: 5, name: 'Area', value: 'area' },
    { id: 6, name: 'Dots', value: 'dots' }
];

export const CHART_TIMEFRAMES = [
    { id: 1, label: '1', value: '1' },
    { id: 2, label: '5', value: '5' },
    { id: 3, label: '15', value: '15' },
    { id: 4, label: '30', value: '30' },
    { id: 5, label: '1h', value: '60' },
    { id: 6, label: '1d', value: 'D' },
    { id: 7, label: '1w', value: 'W' },
    { id: 8, label: '1m', value: 'M' }
];

export const COUNTRY_INFO = [
    { id: 1, name: 'ru', callingCode: '+7', flag: '/src/apps/client/constants/images/ru_flag.svg' },
    { id: 2, name: 'AS', callingCode: '+1', flag: '/src/apps/client/constants/images/as.svg' },
    { id: 3, name: 'AR', callingCode: '+54', flag: '/src/apps/client/constants/images/ar.svg' },
    { id: 4, name: 'AU', callingCode: '+61', flag: '/src/apps/client/constants/images/au.svg' },
    { id: 5, name: 'AT', callingCode: '+43', flag: '/src/apps/client/constants/images/at.svg' },
    { id: 6, name: 'BR', callingCode: '+55', flag: '/src/apps/client/constants/images/br.svg' },
    { id: 7, name: 'IO', callingCode: '+246', flag: '/src/apps/client/constants/images/io.svg' },
    { id: 8, name: 'VG', callingCode: '+1', flag: '/src/apps/client/constants/images/vg.svg' },
    { id: 9, name: 'BG', callingCode: '+359', flag: '/src/apps/client/constants/images/bg.svg' },
    { id: 10, name: 'CA', callingCode: '+1', flag: '/src/apps/client/constants/images/ca.svg' },
    { id: 11, name: 'CL', callingCode: '+56', flag: '/src/apps/client/constants/images/cl.svg' },
    { id: 12, name: 'CY', callingCode: '+357', flag: '/src/apps/client/constants/images/cy.svg' },
    { id: 13, name: 'CZ', callingCode: '+420', flag: '/src/apps/client/constants/images/cz.svg' },
    { id: 14, name: 'DK', callingCode: '+45', flag: '/src/apps/client/constants/images/dk.svg' },
    { id: 15, name: 'EE', callingCode: '+372', flag: '/src/apps/client/constants/images/ee.svg' },
    { id: 16, name: 'FI', callingCode: '+358', flag: '/src/apps/client/constants/images/fi.svg' },
    { id: 17, name: 'FR', callingCode: '+33', flag: '/src/apps/client/constants/images/fr.svg' },
    { id: 18, name: 'GE', callingCode: '+995', flag: '/src/apps/client/constants/images/ge.svg' },
    { id: 19, name: 'DE', callingCode: '+49', flag: '/src/apps/client/constants/images/de.svg' },
    { id: 21, name: 'GR', callingCode: '+30', flag: '/src/apps/client/constants/images/gr.svg' },
    { id: 22, name: 'HK', callingCode: '+852', flag: '/src/apps/client/constants/images/hk.svg' },
    { id: 23, name: 'HU', callingCode: '+36', flag: '/src/apps/client/constants/images/hu.svg' },
    { id: 24, name: 'IS', callingCode: '+354', flag: '/src/apps/client/constants/images/is.svg' },
    { id: 25, name: 'IE', callingCode: '+353', flag: '/src/apps/client/constants/images/ie.svg' },
    { id: 26, name: 'IT', callingCode: '+39', flag: '/src/apps/client/constants/images/it.svg' },
    { id: 27, name: 'JP', callingCode: '+81', flag: '/src/apps/client/constants/images/jp.svg' },
    { id: 28, name: 'LV', callingCode: '+371', flag: '/src/apps/client/constants/images/lv.svg' },
    { id: 29, name: 'LI', callingCode: '+423', flag: '/src/apps/client/constants/images/li.svg' },
    { id: 30, name: 'LT', callingCode: '+370', flag: '/src/apps/client/constants/images/lt.svg' },
    { id: 31, name: 'LU', callingCode: '+352', flag: '/src/apps/client/constants/images/lu.svg' },
    { id: 32, name: 'MO', callingCode: '+853', flag: '/src/apps/client/constants/images/mo.svg' },
    { id: 33, name: 'MT', callingCode: '+356', flag: '/src/apps/client/constants/images/mt.svg' },
    { id: 34, name: 'MD', callingCode: '+373', flag: '/src/apps/client/constants/images/md.svg' },
    { id: 35, name: 'MC', callingCode: '+377', flag: '/src/apps/client/constants/images/mc.svg' },
    { id: 36, name: 'ME', callingCode: '+382', flag: '/src/apps/client/constants/images/me.svg' },
    { id: 37, name: 'NL', callingCode: '+31', flag: '/src/apps/client/constants/images/nl.svg' },
    { id: 38, name: 'NZ', callingCode: '+364', flag: '/src/apps/client/constants/images/nz.svg' },
    { id: 39, name: 'NO', callingCode: '+47', flag: '/src/apps/client/constants/images/no.svg' },
    { id: 40, name: 'PA', callingCode: '+507', flag: '/src/apps/client/constants/images/pa.svg' },
    { id: 41, name: 'PL', callingCode: '+48', flag: '/src/apps/client/constants/images/pl.svg' },
    { id: 42, name: 'PT', callingCode: '+351', flag: '/src/apps/client/constants/images/pt.svg' },
    { id: 43, name: 'QA', callingCode: '+974', flag: '/src/apps/client/constants/images/qa.svg' },
    { id: 44, name: 'SA', callingCode: '+966', flag: '/src/apps/client/constants/images/sa.svg' },
    { id: 45, name: 'SG', callingCode: '+65', flag: '/src/apps/client/constants/images/sg.svg' },
    { id: 46, name: 'SI', callingCode: '+421', flag: '/src/apps/client/constants/images/si.svg' },
    { id: 47, name: 'SK', callingCode: '+386', flag: '/src/apps/client/constants/images/sk.svg' },
    { id: 48, name: 'ZA', callingCode: '+27', flag: '/src/apps/client/constants/images/za.svg' },
    { id: 49, name: 'SS', callingCode: '+82', flag: '/src/apps/client/constants/images/ss.svg' },
    { id: 50, name: 'ES', callingCode: '+34', flag: '/src/apps/client/constants/images/es.svg' },
    { id: 52, name: 'SE', callingCode: '+46', flag: '/src/apps/client/constants/images/se.svg' },
    { id: 53, name: 'CH', callingCode: '+41', flag: '/src/apps/client/constants/images/ch.svg' },
    { id: 54, name: 'TW', callingCode: '+886', flag: '/src/apps/client/constants/images/tw.svg' },
    { id: 55, name: 'TH', callingCode: '+66', flag: '/src/apps/client/constants/images/th.svg' },
    { id: 56, name: 'VG', callingCode: '+1', flag: '/src/apps/client/constants/images/vg.svg' },
    { id: 57, name: 'UAE', callingCode: '+971', flag: '/src/apps/client/constants/images/uae.svg' },
    { id: 58, name: 'GB', callingCode: '+44', flag: '/src/apps/client/constants/images/gb.svg' },
    { id: 59, name: 'US', callingCode: '+1', flag: '/src/apps/client/constants/images/us.svg' },
    { id: 60, name: 'VN', callingCode: '+84', flag: '/src/apps/client/constants/images/vn.svg' }
];

export const AMOUNT = [
    { id: 1, name: 'gold', value: 500 },
    { id: 2, name: 'platinum', value: 1000 },
    { id: 3, name: 'diamond', value: 5000 },
    { id: 4, name: 'vip', value: 10000 }
];

export const LANGUAGES = [
    { id: 1, langCode: 'ru', countryCode: 'ru', name: 'Russian' },
    { id: 2, langCode: 'pl', countryCode: 'PL', name: 'Polish' },
    { id: 3, langCode: 'en', countryCode: 'GB', name: 'English' }
];
