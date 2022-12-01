import jsonwebtoken from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

import { OKEY_STATUS_CODE, FORBIDDEN_STATUS_CODE, SERVER_ERROR_STATUS_CODE, NOT_FOUND_STATUS_CODE } from '../../../../constants/constants';

import getUserByIdQuery from '../../user/queries/getUserById';
import getTransactionsByUserId from '../../transaction/queries/getTransactionsByUserId';
import getPayments from '../../../admin/payment/queries/getPayments';
import getOrdersByInfo from '../../order/queries/getOrdersByInfo';
import Order from '../../order/model';

const publicKey = fs.readFileSync(path.resolve('./server/privateKeys/adminPublicKey.ppk'), 'utf8');

export default function checkAuthentication (req, res) {
    try {
        const token = req.query.token;

        if (!token) {
            return res.status(FORBIDDEN_STATUS_CODE).end();
        }

        jsonwebtoken.verify(token, publicKey, {
            algorithm: 'RS256'
        }, (err, { id: userId }) => {
            if (err) {
                return res.status(FORBIDDEN_STATUS_CODE).end();
            }

            getUserByIdQuery(userId)
                .then(user => {
                    if (!user || user.blocked) {
                        return res.status(NOT_FOUND_STATUS_CODE).end();
                    }

                    return Promise.all([
                        getOrdersByInfo({ userId, isClosed: false }),
                        getOrdersByInfo({ userId, page: 1, perPage: 10, isClosed: true }),
                        Order.countDocuments({ userId, isClosed: true }),
                        getTransactionsByUserId(userId),
                        getPayments()
                    ])
                        .then(([openOrders, closedOrders, countClosedOrders, transactions, payments]) => {
                            const payment = payments[0];
                            // const openOrders = orders.filter(order => !order.isClosed);
                            // const closedOrders = orders.filter(order => order.isClosed);

                            return res.status(OKEY_STATUS_CODE).send({
                                user,
                                openOrders,
                                closedOrders,
                                transactions,
                                payment,
                                countClosedOrders
                            });
                        });
                })
                .catch(() => {
                    res.status(SERVER_ERROR_STATUS_CODE).end();
                });
        });
    } catch (e) {
        res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
