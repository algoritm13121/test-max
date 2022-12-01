import fs from 'fs';
import path from 'path';

import {
    BAD_REQUEST_STATUS_CODE,
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE,
    DOC_NAMES
} from '../../../../constants/constants';
import editUserQuery from '../queries/editUser';

import includes from '@tinkoff/utils/array/includes';

export default function removeDoc (req, res) {
    try {
        const { docName } = req.body;
        const { id } = res.locals.user;

        if (!includes(docName, DOC_NAMES)) {
            return res.status(BAD_REQUEST_STATUS_CODE).end();
        }

        const oldDoc = res.locals.user.docs[docName];

        if (!oldDoc) {
            return res.status(BAD_REQUEST_STATUS_CODE).end();
        }

        editUserQuery({
            id,
            docs: {
                ...res.locals.user.docs,
                [docName]: null
            },
            updatedAt: Date.now()
        })
            .then(user => {
                const oldDocPathFs = path.join(__dirname, '..', oldDoc.path);

                fs.unlinkSync(oldDocPathFs);
                return res.status(OKEY_STATUS_CODE).send({
                    user
                });
            })
            .catch(() => {
                res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    } catch (e) {
        res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
