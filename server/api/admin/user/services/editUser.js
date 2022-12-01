import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import md5 from 'md5';

import prepareUser from '../utils/prepareUser';

import editUserQuery from '../../../client/user/queries/editUser';

export default function editUser (req, res) {
    const user = prepareUser(req.body);

    if (user.password) {
        user.password = md5(user.password);
    }

    editUserQuery(user)
        .then(user => {
            res.status(OKEY_STATUS_CODE).send(user);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
