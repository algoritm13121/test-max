import fs from 'fs';
import path from 'path';

import {
    BAD_REQUEST_STATUS_CODE,
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE
} from '../../../../constants/constants';
import editUserQuery from '../queries/editUser';

import remove from '@tinkoff/utils/array/remove';

export default function removeOtherDoc (req, res) {
    try {
        const { index } = req.body;
        const { id } = res.locals.user;

        const othersDoc = res.locals.user.docs.others;

        if (!othersDoc || !othersDoc[index]) {
            return res.status(BAD_REQUEST_STATUS_CODE).end();
        }

        const oldDoc = othersDoc[index];
        const newDocs = remove(index, 1, othersDoc);

        editUserQuery({
            id,
            docs: {
                ...res.locals.user.docs,
                others: !newDocs.length ? null : newDocs
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
