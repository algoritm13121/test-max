import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import pricesController from '../../../../controllers/pricesController';

export default function getPrices (req, res) {
    try {
        res.status(OKEY_STATUS_CODE).send(pricesController.prices);
    } catch (e) {
        return res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
