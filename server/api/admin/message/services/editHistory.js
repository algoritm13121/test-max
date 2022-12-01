import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import editMessagesByIdQuery from '../queries/editMessagesById';

export default function editHistory (req, res) {
    try {
        const id = req.body.id;

        return editMessagesByIdQuery(id)
            .then(() => {
                return res.status(OKEY_STATUS_CODE).send();
            })
            .catch(() => {
                return res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    } catch (e) {
        return res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
