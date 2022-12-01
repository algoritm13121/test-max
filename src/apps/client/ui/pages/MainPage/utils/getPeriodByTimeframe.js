import subYears from 'date-fns/subYears';
import subDays from 'date-fns/subDays';
import subHours from 'date-fns/subHours';

const getFromFuncMap = {
    currencies: {
        '1': (now, from) => +subHours(from ? from * 1000 : now, 24),
        '5': (now, from) => +subHours(from ? from * 1000 : now, 24 * 5),
        '15': (now, from) => +subHours(from ? from * 1000 : now, 24 * 15),
        '30': (now, from) => +subHours(from ? from * 1000 : now, 24 * 30),
        '60': (now, from) => +subHours(from ? from * 1000 : now, 24 * 60),
        'D': (now, from) => +subDays(from ? from * 1000 : now, 1000),
        'W': (now, from) => +subDays(from ? from * 1000 : now, 1000),
        'M': (now, from) => +subYears(from ? from * 1000 : now, 10)
    },
    products: {
        '1': (now, from) => +subHours(from ? from * 1000 : now, 24),
        '5': (now, from) => +subHours(from ? from * 1000 : now, 24 * 5),
        '15': (now, from) => +subHours(from ? from * 1000 : now, 24 * 15),
        '30': (now, from) => +subHours(from ? from * 1000 : now, 24 * 30),
        '60': (now, from) => +subHours(from ? from * 1000 : now, 24 * 60),
        'D': (now, from) => +subDays(from ? from * 1000 : now, 1000),
        'W': (now, from) => +subDays(from ? from * 1000 : now, 1000),
        'M': (now, from) => +subYears(from ? from * 1000 : now, 10)
    },
    shares: {
        '1': (now, from) => +subHours(from ? from * 1000 : now, 24),
        '5': (now, from) => +subHours(from ? from * 1000 : now, 24 * 5),
        '15': (now, from) => +subHours(from ? from * 1000 : now, 24 * 15),
        '30': (now, from) => +subHours(from ? from * 1000 : now, 24 * 30),
        '60': (now, from) => +subHours(from ? from * 1000 : now, 24 * 60),
        'D': (now, from) => +subDays(from ? from * 1000 : now, 1000),
        'W': (now, from) => +subDays(from ? from * 1000 : now, 1000),
        'M': (now, from) => +subYears(from ? from * 1000 : now, 10)
    },
    indices: {
        '1': (now, from) => +subHours(from ? from * 1000 : now, 8),
        '5': (now, from) => +subHours(from ? from * 1000 : now, 8 * 5),
        '15': (now, from) => +subHours(from ? from * 1000 : now, 8 * 15),
        '30': (now, from) => +subHours(from ? from * 1000 : now, 8 * 30),
        '60': (now, from) => +subHours(from ? from * 1000 : now, 8 * 60),
        'D': (now, from) => +subDays(from ? from * 1000 : now, 500),
        'W': (now, from) => +subDays(from ? from * 1000 : now, 500),
        'M': (now, from) => +subYears(from ? from * 1000 : now, 3)
    },
    crypto: {
        '1': (now, from) => +subHours(from ? from * 1000 : now, 8),
        '5': (now, from) => +subHours(from ? from * 1000 : now, 8 * 5),
        '15': (now, from) => +subHours(from ? from * 1000 : now, 8 * 15),
        '30': (now, from) => +subHours(from ? from * 1000 : now, 8 * 30),
        '60': (now, from) => +subHours(from ? from * 1000 : now, 8 * 60),
        'D': (now, from) => +subDays(from ? from * 1000 : now, 500),
        'W': (now, from) => +subDays(from ? from * 1000 : now, 500),
        'M': (now, from) => +subYears(from ? from * 1000 : now, 3)
    }
};

export default function getPeriodByTimeframe (timeframe, symbolGroup, from) {
    const now = Date.now();
    const getFrom = getFromFuncMap[symbolGroup][timeframe];

    switch (timeframe) {
    case '1':
        return {
            from: +`${getFrom(now, +from) / 1000}`.split('.')[0],
            to: +from || `${now / 1000}`.split('.')[0]
        };
    case '5':
        return {
            from: +`${getFrom(now, +from) / 1000}`.split('.')[0],
            to: +from || `${now / 1000}`.split('.')[0]
        };
    case '15':
        return {
            from: +`${getFrom(now, +from) / 1000}`.split('.')[0],
            to: +from || `${now / 1000}`.split('.')[0]
        };
    case '30':
        return {
            from: +`${getFrom(now, +from) / 1000}`.split('.')[0],
            to: +from || `${now / 1000}`.split('.')[0]
        };
    case '60':
        return {
            from: +`${getFrom(now, +from) / 1000}`.split('.')[0],
            to: +from || `${now / 1000}`.split('.')[0]
        };
    case 'D':
        return {
            from: +`${getFrom(now, +from) / 1000}`.split('.')[0],
            to: +from || `${now / 1000}`.split('.')[0]
        };
    case 'W':
        return {
            from: +`${getFrom(now, +from) / 1000}`.split('.')[0],
            to: +from || `${now / 1000}`.split('.')[0]
        };
    case 'M':
        return {
            from: +`${getFrom(now, +from) / 1000}`.split('.')[0],
            to: +from || `${now / 1000}`.split('.')[0]
        };
    }
}
