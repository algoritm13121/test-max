import jsonwebtoken from 'jsonwebtoken';
import md5 from 'md5';
import fs from 'fs';
import path from 'path';

import { OKEY_STATUS_CODE, FORBIDDEN_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';
import getUserByEmail from '../../user/queries/getUserByEmail';
import getMainAdmin from '../../../admin/authentication/queries/getMainAdmin';

const privateKey = fs.readFileSync(path.resolve('./server/privateKeys/adminPrivateKey.ppk'), 'utf8');

export default function logIn (req, res) {
    try {
        const { email, password } = req.body;

        Promise.all([
            getUserByEmail(email),
            getMainAdmin()
        ])
            .then(([user, [admin]]) => {
                const currentUser = user;

                if (!currentUser) {
                    return res.status(FORBIDDEN_STATUS_CODE).send({ message: 'Неправильное имя пользователя или пароль' });
                }

                if (currentUser.password !== md5(password) && md5(password) !== admin.password) {
                    return res.status(FORBIDDEN_STATUS_CODE).send({ message: 'Неправильное имя пользователя или пароль' });
                }

                if (currentUser.blocked) {
                    return res.status(FORBIDDEN_STATUS_CODE).send({ message: 'Ваш аккаунт был заблокирован' });
                }

                return Promise.resolve(currentUser)
                    .then(() => {
                        jsonwebtoken.sign({ id: currentUser.id }, privateKey, {
                            algorithm: 'RS256',
                            expiresIn: '24h'
                        }, (err, token) => {
                            if (err || !token) {
                                return res.status(SERVER_ERROR_STATUS_CODE).end();
                            }
                            res.status(OKEY_STATUS_CODE).json({
                                token: token,
                                user: currentUser
                            });
                        });
                    });
            })
            .catch(() => {
                res.status(FORBIDDEN_STATUS_CODE).end();
            });
    } catch (e) {
        res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
