import md5 from 'md5';
import fs from 'fs';
import path from 'path';
import jsonwebtoken from 'jsonwebtoken';

import editUserQuery from '../queries/editUser';
import getUserByEmail from '../queries/getUserByEmail';

import templateEmail from './templateEmail/templateEmail';

import {
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE,
    UNAUTHORIZED_STATUS_CODE
} from '../../../../constants/constants';

import sendEmail from '../../../../helpers/sendEmail';

const privateKey = fs.readFileSync(path.resolve('./server/privateKeys/adminPrivateKey.ppk'), 'utf8');

const SUBJECT = 'Ваш новый пароль на платформе IMEX FINANCE';

export default function resetUserPassword (req, res) {
    try {
        const { email } = req.body;

        getUserByEmail(email)
            .then((user) => {
                if (!user) {
                    return res.status(UNAUTHORIZED_STATUS_CODE).send({ error: 'Пользователь не найден' });
                }

                const password = Math.random().toString(36).slice(2);

                user.password = md5(password);

                return editUserQuery(user)
                    .then(() => {
                        res.status(OKEY_STATUS_CODE).end();

                        jsonwebtoken.sign({ id: user.id }, privateKey, {
                            algorithm: 'RS256',
                            expiresIn: '99999y'
                        }, (err, token) => {
                            if (err || !token) {
                                return;
                            }
                            sendEmail(email, {
                                subject: SUBJECT,
                                content: templateEmail(
                                    user.name,
                                    user.surname,
                                    { header: 'Ваш пароль успешно обновлен', body: `Ваш новый пароль - ${password}` },
                                    token
                                )
                            });
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
