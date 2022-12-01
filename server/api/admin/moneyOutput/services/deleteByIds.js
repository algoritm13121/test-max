import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllOutputs from '../../../client/moneyOutput/queries/getMoneyOutput';
import deleteByIdsQuery from '../../../client/moneyOutput/queries/deleteByIds';

export default function deleteByIds (req, res) {
    const { ids } = req.body;

    deleteByIdsQuery(ids)
        .then(() => {
            getAllOutputs()
                .then(output => {
                    res.status(OKEY_STATUS_CODE).send(output);
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
