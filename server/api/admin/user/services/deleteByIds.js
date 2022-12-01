import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getAllUsers from '../../../client/user/queries/getAllUsers';
import deleteByIdsQuery from '../../../client/user/queries/deleteByIds';

export default function deleteByIds (req, res) {
    const { ids } = req.body;

    deleteByIdsQuery(ids)
        .then(() => {
            getAllUsers()
                .then(users => {
                    res.status(OKEY_STATUS_CODE).send(users);
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
