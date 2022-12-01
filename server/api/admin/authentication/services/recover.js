import jsonwebtoken from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

import { OKEY_STATUS_CODE, FORBIDDEN_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';
import getAdminByEmail from '../queries/getAdminByEmail';
import sendEmail from '../../../../helpers/sendEmail';

import { RECOVERY_URL } from '../../../../../src/apps/admin/constants/constants';

const privateKey = fs.readFileSync(path.resolve('./server/privateKeys/adminPrivateKey.ppk'), 'utf8');

export default function recover (req, res) {
    try {
        const email = req.query.email;

        getAdminByEmail(email)
            .then(admin => {
                if (!admin) {
                    return res.status(FORBIDDEN_STATUS_CODE).end();
                }

                jsonwebtoken.sign(admin.toJSON(), privateKey, {
                    algorithm: 'RS256',
                    expiresIn: '24h'
                }, (err, token) => {
                    if (err || !token) {
                        return res.status(SERVER_ERROR_STATUS_CODE).end();
                    }

                    const subject = 'Восстановление учетной записи';
                    const host = req.get('host');
                    const recoveryUrl = `${req.protocol}://${host}${RECOVERY_URL}?recovery-token=${token}&&email=${admin.email}`;
                    const successCallback = () => res.sendStatus(OKEY_STATUS_CODE);
                    const failureCallback = () => res.sendStatus(SERVER_ERROR_STATUS_CODE);

                    sendEmail(
                        admin.email,
                        {
                            subject,
                            content: `<a href=${recoveryUrl} target="_blank">Ссылка на форму восстановления</a>`
                        },
                        {
                            success: successCallback,
                            failure: failureCallback
                        }
                    );
                });
            })
            .catch(() => {
                res.status(FORBIDDEN_STATUS_CODE).end();
            });
    } catch (e) {
        res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
