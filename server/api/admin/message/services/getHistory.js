import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getMessagesQuery from '../../../client/message/queries/getMessages';

export default function getHistory (req, res) {
    try {
        return getMessagesQuery()
            .then(messages => {
                return res.status(OKEY_STATUS_CODE).send(messages);
            })
            .catch(() => {
                return res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    } catch (e) {
        return res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
