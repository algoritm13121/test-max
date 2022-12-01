import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import saveTokenQuery from '../../../client/qiwi/queries/saveToken';
import removeOldTokenQuery from '../../../client/qiwi/queries/removeOldToken';

export default function saveToken (req, res) {
    try {
        const { qiwi } = req.query;

        if (!qiwi) {
            return res.status(SERVER_ERROR_STATUS_CODE).end();
        }

        const now = Date.now();

        removeOldTokenQuery()
            .then(() => {
                return saveTokenQuery({
                    token: qiwi,
                    createdAt: now
                })
                    .then(() => {
                        return res.status(OKEY_STATUS_CODE).end();
                    });
            })
            .catch(() => {
                return res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    } catch (e) {
        return res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
