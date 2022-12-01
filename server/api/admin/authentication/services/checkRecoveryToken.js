import jsonwebtoken from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

import { OKEY_STATUS_CODE, FORBIDDEN_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';
import getAdminByEmail from '../queries/getAdminByEmail';

const publicKey = fs.readFileSync(path.resolve('./server/privateKeys/adminPublicKey.ppk'), 'utf8');

export default function checkRecoveryToken (req, res) {
    try {
        const { token, email } = req.query;

        if (!token || !email) {
            return res.status(FORBIDDEN_STATUS_CODE).end();
        }

        getAdminByEmail(email)
            .then((admin) => {
                if (!admin) {
                    return res.status(FORBIDDEN_STATUS_CODE).end();
                }

                jsonwebtoken.verify(token, publicKey, {
                    algorithm: 'RS256'
                }, err => {
                    if (err) {
                        return res.status(FORBIDDEN_STATUS_CODE).end();
                    }

                    res.status(OKEY_STATUS_CODE).end();
                });
            })
            .catch(() => {
                res.status(FORBIDDEN_STATUS_CODE).end();
            });
    } catch (e) {
        res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
