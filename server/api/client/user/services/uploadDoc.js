import fs from 'fs';

import includes from '@tinkoff/utils/array/includes';
import multipart from '../../../../helpers/multipart';

import {
    OKEY_STATUS_CODE,
    BAD_REQUEST_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE,
    DOC_NAMES
} from '../../../../constants/constants';

import editUserQuery from '../queries/editUser';
import getUserById from '../queries/getUserById';

const uploader = multipart();

export default function updateDoc (req, res) {
    try {
        uploader(req, res, (err) => {
            if (err || !req.files[0]) {
                return res.status(SERVER_ERROR_STATUS_CODE).end();
            }

            const file = req.files[0];
            const filePath = `/${file.path.replace(/\\/g, '/')}`;
            const { docName } = req.body;

            if (!includes(docName, DOC_NAMES)) {
                fs.unlinkSync(filePath);
                return res.status(BAD_REQUEST_STATUS_CODE).end();
            }

            const { id } = res.locals.user;

            editUserQuery({
                id,
                docs: {
                    ...res.locals.user.docs,
                    ...docName === 'others'
                        ? { others: [...(res.locals.user.docs.others || []), { path: filePath, name: file.originalname }] }
                        : { [docName]: { path: filePath, name: file.originalname } }
                },
                updatedAt: Date.now()
            })
                .then(() => {
                    getUserById(id)
                        .then(() => {
                            editUserQuery({ id })
                                .then((user) => {
                                    return res.status(OKEY_STATUS_CODE).send({
                                        user
                                    });
                                })
                                .catch(() => {
                                    res.status(SERVER_ERROR_STATUS_CODE).end();
                                });
                        })
                        .catch(() => {
                            res.status(SERVER_ERROR_STATUS_CODE).end();
                        });
                })
                .catch(() => {
                    res.status(SERVER_ERROR_STATUS_CODE).end();
                });
        });
    } catch (e) {
        res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
