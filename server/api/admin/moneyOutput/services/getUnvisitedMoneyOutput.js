import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getMoneyOutputQuery from '../../../client/moneyOutput/queries/getMoneyOutput';

export default function getUnvisitedMoneyOutput (req, res) {
    getMoneyOutputQuery()
        .then(outputs => {
            const unvisitedOnly = outputs.filter((item) => { return item.visited === false; });
            res.status(OKEY_STATUS_CODE).send(unvisitedOnly);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
