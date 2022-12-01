import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getTokenQuery from '../../../client/qiwi/queries/getToken';

export default function saveToken (req, res) {
    try {
        return getTokenQuery()
            .then(token => {
                return res.status(OKEY_STATUS_CODE).send(token);
            })
            .catch(() => {
                return res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    } catch (e) {
        return res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
