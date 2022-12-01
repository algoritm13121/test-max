import uniqid from 'uniqid';

import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import prepareUser from '../utils/prepareUser';

import saveUserQuery from '../../../client/user/queries/saveUser';

export default function saveUser (req, res) {
    const user = prepareUser(req.body);
    const id = uniqid();
    const date = Date.now();
    const views = 0;

    saveUserQuery({ ...user, views, date, id })
        .then(user => {
            res.status(OKEY_STATUS_CODE).send(user);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
