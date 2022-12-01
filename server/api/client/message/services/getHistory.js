import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getMessagesByIdQuery from '../queries/getMessagesById';

export default function getHistory (req, res) {
    try {
        const { id } = res.locals.user;

        return getMessagesByIdQuery(id)
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
