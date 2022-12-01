import getAllUsers from '../../../client/user/queries/getAllUsers';

import {
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE
} from '../../../../constants/constants';

export default function getUsers (req, res) {
    try {
        getAllUsers()
            .then(users => {
                res.status(OKEY_STATUS_CODE).send(users);
            })
            .catch((e) => {
                res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    } catch (e) {
        res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
