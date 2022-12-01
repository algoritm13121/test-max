import 'log-timestamp-moment';
import request from 'superagent';
import base from '../../src/apps/admin/services/base';

import { token } from '../constants';

export class OrderCheckRequests {
    constructor () {
        this.prefix = 'http://localhost:4000';

        this.createOrdersList();
        // this.closeOrdersByList();
    }

    closeOrdersByList () {
        this.getOredrs().then((orders) => {
            console.log('after get orders', orders);

            let count = 0;
            for (const order of orders) {
                count++;
                this.closeOrder(order.id).then(() => console.log(`closed ${count}`));
            }
        });
    }

    createOrdersList (count = 500) {
        for (let i = 0; i < count; i++) {
            this.openOrder({
                'assetName': 'BINANCE:BTCUSDT',
                'amount': 0.01,
                'type': 'buy',
                'takeProfit': '499.00',
                'stopLoss': '469.00',
                autoClose: true }).then(() => {
                console.log(`req ${i}`);
            });
        }
    }

    openOrder (order) {
        console.log('openOrder');
        return base(request
            .post(`${this.prefix}/api/client/order/new`)
            .send(order)
            .query({ token })).catch(e => console.log(e));
    }

    closeOrder (id) {
        console.log('closeOrder');
        return base(
            request
                .get(`${this.prefix}/api/client/order/close/${id}`)
                .query({ token })
        );
    }

    getOredrs () {
        console.log('before get orders');
        return base(
            request
                .get(`${this.prefix}/api/client/order/all-open`)
                // .query({ token })
        );
    }
}

const app = new OrderCheckRequests();

// Open 500 orders

// 13:36:47 start

// 13:37:21 end

// all time 34 sec

// second test 16:37:21-16:38:27

// --------------------------

// Close 500 orders

//  14:11:27

//  14:11:58 end

// all time 31 sec
