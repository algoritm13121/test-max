import request from 'superagent';
import base from '../base';

import { FINNHUB_API_KEY } from '../../../../../server/constants/constants';

const symbolApiMap = {
    currencies: 'https://finnhub.io/api/v1/forex/candle',
    products: 'https://finnhub.io/api/v1/forex/candle',
    shares: 'https://finnhub.io/api/v1/stock/candle',
    indices: 'https://finnhub.io/api/v1/stock/candle',
    crypto: 'https://finnhub.io/api/v1/crypto/candle'
};

export default function getHistoryPrice ({
    symbolGroup, symbol, from, to, resolution
}) {
    return () => {
        return base(
            request
                .get(symbolApiMap[symbolGroup])
                .query({
                    symbol,
                    resolution,
                    from,
                    to,
                    token: FINNHUB_API_KEY
                })
        );
    };
}
