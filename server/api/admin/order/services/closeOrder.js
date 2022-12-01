import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE, BAD_REQUEST_STATUS_CODE } from '../../../../constants/constants';

import editUserQuery from '../../../client/user/queries/editUser';
import editOrderQuery from '../../../client/order/queries/editOrder';
import getUserById from '../../../client/user/queries/getUserById';

import { getCommission, getProfit } from '../../../../../src/apps/client/utils/getAssetValues';
import getOrderById from '../../../client/order/queries/getOrderById';
import { COMMISSION } from '../../../../../src/apps/client/constants/constants';
import { CHART_SYMBOL_INFO_MAP } from '../../../../constants/symbols';
import numeral from 'numeral';

export default function closeOrder (req, res) {
    try {
        const orderInfo = req.body;
        getOrderById(orderInfo.id)
            .then(order => {
                getUserById(order.userId)
                    .then(user => {
                        if (!order || order.userId !== user.id) {
                            return res.status(BAD_REQUEST_STATUS_CODE).send();
                        }

                        const closedOrder = {
                            id: order.id,
                            isClosed: orderInfo.isClosed,
                            closedAt: orderInfo.closedAt,
                            closedPrice: numeral(orderInfo.closedPrice).value()
                        };

                        const asset = CHART_SYMBOL_INFO_MAP[order.assetName];
                        const profit = getProfit(order.amount, order.openingPrice, closedOrder.closedPrice, order.type, asset);
                        const commission = getCommission(order.pledge, COMMISSION);
                        const updatedUser = {
                            id: orderInfo.userId,
                            balance: user.balance + profit - commission
                        };

                        Promise.all([
                            editOrderQuery(closedOrder),
                            editUserQuery(updatedUser)
                        ])
                            .then(() => {
                                res.status(OKEY_STATUS_CODE).end();
                            });
                    })
                    .catch(() => {
                        res.status(SERVER_ERROR_STATUS_CODE).end();
                    });
            })
            .catch(() => {
                res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    } catch (e) {
        res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
