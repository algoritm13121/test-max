import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getMoneyOutputQuery from '../../../client/moneyOutput/queries/getMoneyOutput';

export default function getMoneyOutput (req, res) {
    getMoneyOutputQuery()
        .then(outputs => {
            res.status(OKEY_STATUS_CODE).send(outputs);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
