import EventEmitter from 'eventemitter3';

import getAllUsers from '../api/client/user/queries/getAllUsers';
import getOpenedOrders from '../api/client/order/queries/getOpenedOrders';
import closeAllOrders from '../api/client/order/services/closeAllOrders';

import calcUserOrdersChanges from '../../src/apps/client/utils/calcUserOrdersChanges';

import { pricesEvents } from '../controllers/pricesController';

import { SYMBOL_PRICE_CHANGE_EVENT } from '../constants/constants';

export const ordersEvents = new EventEmitter();

let usersVar;
let ordersMapByUserIdVar;

function handlePriceChange ({ prices, assetPriceChange }) {
    usersVar.forEach(user => {
        const userOrders = ordersMapByUserIdVar[user.id];

        if (!userOrders || !userOrders.length || !userOrders.some(order => order.assetName === assetPriceChange.name)) {
            return;
        }

        const { balance } = calcUserOrdersChanges(user, userOrders, prices);

        let newBalance = balance;
        user.bonuses && user.bonuses > 0 ? newBalance += user.bonuses : '';
        user.credFacilities && user.credFacilities > 0 ? newBalance += user.credFacilities : '';

        if (newBalance <= 0) {
            closeAllOrders(user.id);
        }
    });
}

class OrdersController {
    constructor () {
        ordersEvents.on('dbUpdate', this.setCalculator);
    }

    start () {
        this.setCalculator();
    }

    setCalculator () {
        pricesEvents.removeListener(SYMBOL_PRICE_CHANGE_EVENT, handlePriceChange);

        Promise.all([
            getAllUsers(),
            getOpenedOrders()
        ])
            .then(([users, orders]) => {
                const ordersMapByUserId = orders.reduce((result, order) => {
                    if (!result[order.userId]) {
                        result[order.userId] = [];
                    }

                    result[order.userId].push(order);

                    return result;
                }, {});
                usersVar = users;
                ordersMapByUserIdVar = ordersMapByUserId;
                pricesEvents.on(SYMBOL_PRICE_CHANGE_EVENT, handlePriceChange);
            });
    }
}

const ordersController = new OrdersController();

export default ordersController;
