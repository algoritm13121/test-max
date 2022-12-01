import { AUTO_CLOSE_ORDER_EVENT, FINNHUB_API_KEY, SYMBOL_PRICE_CHANGE_EVENT, DOMAIN } from '../constants/constants';
import WebSocket from 'ws';
import EventEmitter from 'eventemitter3';
import _remove from 'lodash.remove';
import fs from 'fs';
import path from 'path';
import Bluebird from 'bluebird';

import last from '@tinkoff/utils/array/last';
import isUndefined from '@tinkoff/utils/is/undefined';

import schedule from 'node-schedule';

import {
    CURRENCIES_SYMBOLS,
    VALUES_SYMBOLS,
    COMPANY_SHARES_SYMBOLS,
    INDICES_SYMBOLS,
    CRYPTO_CURRENCIES_SYMBOLS,
    CHART_SYMBOL_GROUPS,
    CHART_SYMBOL_INFO_MAP
} from '../constants/symbols';

import getPeriodByTimeframe from '../../src/apps/client/ui/pages/MainPage/utils/getPeriodByTimeframe';
import getHistoryPrice from '../../src/apps/client/services/client/getHistoryPrice';
import { getOpeningSlotPrice } from '../../src/apps/client/utils/getAssetValues';
import base from '../../src/apps/admin/services/base';
import request from 'superagent';

export const pricesEvents = new EventEmitter();

const key = fs.readFileSync(path.resolve('./server/https/private.key'), 'utf8');
const cert = fs.readFileSync(path.resolve('./server/https/certificate.crt'), 'utf8');

class PricesController {
    prices = {};
    prevPrices = {};

    constructor () {
        this.orders = [];

        this.prefix = process.env.NODE_ENV === 'production' ? `https://${DOMAIN}` : 'http://localhost:4000';

        this.getOredrs().then((orders) => {
            // console.log('constructor -> getOredrs');
            this.orders = orders;

            this.checkBeforeCloseOrder();
        }).catch((e) => e);

        setInterval(() => {
            this.getOredrs().then((orders) => {
                this.orders = orders;
            }).catch(e => e);
        }, 10 * 1000);
    }

    start () {
        // if (process.env.NODE_ENV === 'production') {
        this.getInitPrices();
        // }

        const setWebsocket = () => {
            try {
                const socket = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`);

                socket.addEventListener('open', () => {
                    CURRENCIES_SYMBOLS.forEach(({ name }) => {
                        socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': name }));
                    });
                    VALUES_SYMBOLS.forEach(({ name }) => {
                        socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': name }));
                    });
                    COMPANY_SHARES_SYMBOLS.forEach(({ name }) => {
                        socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': name }));
                    });
                    INDICES_SYMBOLS.forEach(({ name }) => {
                        socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': name }));
                    });
                    CRYPTO_CURRENCIES_SYMBOLS.forEach(({ name }) => {
                        socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': name }));
                    });
                });

                socket.addEventListener('message', event => {
                    const data = JSON.parse(event.data);

                    if (!data.data) {
                        return;
                    }
                    const newPrice = data.data[0].p;
                    const symbolName = data.data[0].s;
                    const symbolTime = data.data[0].t;

                    if (newPrice === this.prices[symbolName]) {
                        return;
                    }

                    const assetPriceChange = {
                        name: symbolName,
                        price: newPrice,
                        time: symbolTime,
                        changes: newPrice > this.prices[symbolName] ? 'up' : 'down'
                    };
                    this.prevPrices[symbolName] = this.prices[symbolName];
                    this.prices[symbolName] = newPrice;

                    assetPriceChange.prevPrice = this.prevPrices[symbolName];

                    pricesEvents.emit(SYMBOL_PRICE_CHANGE_EVENT, { prices: this.prices, assetPriceChange });
                });

                // socket.addEventListener('error', (data) => console.log(data));
                socket.addEventListener('error', (data) => data);

                socket.addEventListener('close', (data) => {
                    // console.log('socket close', data);
                    setTimeout(() => {
                        setWebsocket();
                    }, 1000);
                });

                this.socket = socket;
            } catch (e) {}
        };

        setWebsocket();

        schedule.scheduleJob({ hour: 6 }, this.restartConnection);
        schedule.scheduleJob({ hour: 8 }, this.restartConnection);
        schedule.scheduleJob({ hour: 10 }, this.restartConnection);
        schedule.scheduleJob({ hour: 12 }, this.restartConnection);
        schedule.scheduleJob({ hour: 14 }, this.restartConnection);
        schedule.scheduleJob({ hour: 16 }, this.restartConnection);
        schedule.scheduleJob({ hour: 18 }, this.restartConnection);
        schedule.scheduleJob({ hour: 18 }, this.restartConnection);
        schedule.scheduleJob({ hour: 20 }, this.restartConnection);
        schedule.scheduleJob({ hour: 22 }, this.restartConnection);
        schedule.scheduleJob({ minute: 10 }, this.restartConnection);
        schedule.scheduleJob({ minute: 35 }, this.restartConnection);
        schedule.scheduleJob({ minute: 55 }, this.restartConnection);
    }

    restartConnection = () => {
        // this.socket && this.socket.close();
    };

    getInitPrices () {
        try {
            const timeframe = '5';
            const symbolsInfo = CHART_SYMBOL_GROUPS.reduce((result, assetGroup) => {
                return [
                    ...result,
                    ...assetGroup.symbols.map(symbol => ({
                        ...getPeriodByTimeframe(timeframe, assetGroup.id),
                        resolution: timeframe,
                        symbolGroup: assetGroup.id,
                        symbol: symbol.name
                    }))
                ];
            }, []);
            const getHistoryFuncs = symbolsInfo.map(info => getHistoryPrice(info));
            for (let i = 0; i < Math.ceil(getHistoryFuncs.length / 10); i++) {
                const currentSymbols = symbolsInfo.slice(i * 10, (i + 1) * 10);

                setTimeout(() => {
                    Promise.all(
                        currentSymbols.map(info => getHistoryPrice(info)())
                    )
                        .then(prices => {
                            prices.forEach((data, i) => {
                                if (!data.c) {
                                    return;
                                }

                                if (isUndefined(this.prices[currentSymbols[i].symbol])) {
                                    this.prices = {
                                        ...this.prices,
                                        [currentSymbols[i].symbol]: last(data.c)
                                    };
                                }

                                if (isUndefined(this.prevPrices[currentSymbols[i].symbol])) {
                                    if (isUndefined(this.prices[currentSymbols[i].symbol])) {
                                        this.prevPrices = {
                                            ...this.prevPrices,
                                            [currentSymbols[i].symbol]: data.c[data.c.length - 2]
                                        };
                                    } else {
                                        this.prevPrices = {
                                            ...this.prevPrices,
                                            [currentSymbols[i].symbol]: data.c[data.c.length - 1]
                                        };
                                    }
                                }
                            });
                        })
                        .catch(() => {});
                }, i * 30000);
            }
        } catch (e) {}
    }

    async checkBeforeCloseOrder () {
        // console.log('this.orders', this.orders.length);
        for (const order of this.orders) {
            const assetPrice = this.prices[order.assetName];
            // const asset = CHART_SYMBOL_INFO_MAP[order.assetName];

            // const openingSlotPrice = getOpeningSlotPrice(asset, assetPrice);
            let orderType;
            if (order.type === 'buy' && (order.takeProfit && assetPrice >= order.takeProfit && assetPrice > order.openingPrice &&
                (orderType = 'takeProfit') || order.stopLoss && assetPrice <= order.stopLoss && assetPrice < order.openingPrice &&
                (orderType = 'stopLoss'))) {
                // console.log('close buy -> order.id', `old ${order.openingPrice}`, `new assetPrice ${assetPrice}`);
                _remove(this.orders, (item) => order.id === item.id);
                this.closeOrder(order.id, order.userId, order[orderType]).then((data) => pricesEvents.emit(AUTO_CLOSE_ORDER_EVENT, data)).catch(e => e);
            }

            if (order.type === 'sell' && (order.takeProfit && assetPrice <= order.takeProfit && assetPrice < order.openingPrice &&
                (orderType = 'takeProfit') || order.stopLoss && assetPrice >= order.stopLoss && assetPrice > order.openingPrice &&
                (orderType = 'stopLoss'))) {
                // console.log('close sell -> order.id', `old ${order.openingPrice}`, `new $${openingSlotPrice}`);
                _remove(this.orders, (item) => order.id === item.id);
                this.closeOrder(order.id, order.userId, order[orderType]).then((data) => pricesEvents.emit(AUTO_CLOSE_ORDER_EVENT, data)).catch(e => e);
            }
        }

        await Bluebird.delay(1000);
        await this.checkBeforeCloseOrder();
    }

    async getOredrs () {
        return base(
            request
                .get(`${this.prefix}/api/client/order/all-open`)
                .cert(cert)
                .key(key)
        );
    }

    closeOrder (id, userId, closedPrice) {
        return base(
            request
                .get(`${this.prefix}/api/client/order/close-all/${id}__${userId}__${closedPrice}`)
                .cert(cert)
                .key(key)
        );
    }
}

const pricesController = new PricesController();

export default pricesController;
