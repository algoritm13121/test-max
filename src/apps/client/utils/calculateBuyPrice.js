import { CHART_SYMBOL_INFO_MAP } from '../../../../server/constants/symbols';
const calculateBuyingPrice = (name, price) => {
    return price;
    // eslint-disable-next-line no-unreachable
    const { groupId } = CHART_SYMBOL_INFO_MAP[name];

    if (name === 'BINANCE:BTCUSDT') {
        return price * 1.000125;
    } else if (name === 'AMZN') {
        return price * 1.00032;
    }

    switch (groupId) {
    case 'crypto':
        return price * 1.0075;
    case 'currencies':
        return price * 1.0015;
    case 'products':
        return price * 1.0011;
    case 'shares':
        return price * 1.0025;
    case 'indices':
        return price * 1.0003;
    default:
        return price;
    }
};

export default calculateBuyingPrice;
