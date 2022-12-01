import uniqid from 'uniqid';
import each from '@tinkoff/utils/object/each';

import saveOrderQuery from '../queries/saveOrder';
import editUser from '../../user/queries/editUser';
import numeral from 'numeral';

import {
    BAD_REQUEST_STATUS_CODE,
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE
} from '../../../../constants/constants';

import {
    CHART_SYMBOL_INFO_MAP
} from '../../../../constants/symbols';
import { orderFieldsValidatorsMap } from '../utils/fieldsAndValidation';
import { getOpeningSlotPrice, getPledge } from '../../../../../src/apps/client/utils/getAssetValues';

import pricesController from '../../../../controllers/pricesController';

import calculateBuyingPrice from '../../../../../src/apps/client/utils/calculateBuyPrice';
import getOrdersByInfo from '../queries/getOrdersByInfo';
import Order from '../model';

const validate = (fields, fieldsValidatorsMap) => {
    let isValid = true;

    each((value, key) => {
        const validators = fieldsValidatorsMap[key];

        validators && validators.forEach(validator => {
            if (!validator(value)) {
                isValid = false;
            }
        });
    }, fields);

    return isValid;
};

export default function saveOrder (req, res) {
    try {
        const {
            assetName,
            amount,
            type,
            takeProfit,
            stopLoss,
            autoClose
        } = req.body;
        const openingPrice = pricesController.prices[assetName];
        const openingPriceReal = type === 'sell' ? openingPrice : calculateBuyingPrice(assetName, openingPrice);
        const asset = CHART_SYMBOL_INFO_MAP[assetName];

        if (!asset) {
            return res.status(BAD_REQUEST_STATUS_CODE).end();
        }

        const { id: userId, balance } = res.locals.user;
        const openingSlotPrice = getOpeningSlotPrice(asset, openingPriceReal);
        const pledge = +numeral(getPledge(amount, openingSlotPrice)).format('0.00');
        const orderObj = {
            assetName,
            amount,
            openingPrice: openingPriceReal,
            pledge,
            userId,
            type,
            id: uniqid(),
            isClosed: false,
            createdAt: Date.now(),
            takeProfit: takeProfit || 0,
            stopLoss: stopLoss || 0,
            autoClose
        };

        const isOrderValid = validate(orderObj, orderFieldsValidatorsMap);

        if (!isOrderValid) {
            return res.status(BAD_REQUEST_STATUS_CODE).send({ error: 'Значения не являются допустимыми' });
        }

        return saveOrderQuery(orderObj)
            .then(async () => {
                editUser({ id: userId, mainBalance: balance });

                const openOrders = await getOrdersByInfo({ userId, isClosed: false });
                // const closedOrders = await getOrdersByInfo({ userId, page: 1, perPage: 10, isClosed: true });
                const countClosedOrders = await Order.countDocuments({ userId, isClosed: true });
                return res.status(OKEY_STATUS_CODE).send({ openOrders, /* closedOrders, */ countClosedOrders });
            })
            .catch(() => {
                res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    } catch (e) {
        res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
