import getUserByEmail from '../../user/queries/getUserByEmail';
import getUsersCount from '../../user/queries/getUsersCount';

import uniqid from 'uniqid';
import md5 from 'md5';
import fs from 'fs';
import path from 'path';
import jsonwebtoken from 'jsonwebtoken';
import each from '@tinkoff/utils/object/each';

import saveUserQuery from '../queries/saveUser';
import sendEmail from '../../../../helpers/sendEmail';

import templateEmail from './templateEmail/templateEmail';

import {
    BAD_REQUEST_STATUS_CODE,
    FORBIDDEN_STATUS_CODE,
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE
} from '../../../../constants/constants';
import { userFieldsValidatorsMap } from '../utils/registrationFieldsAndValidation';
import getStatus from '../../../../helpers/getStatus';

const privateKey = fs.readFileSync(path.resolve('./server/privateKeys/adminPrivateKey.ppk'), 'utf8');

const INITIAL_USER_NUMBER = 144655;
const INITIAL_BALANCE = 0;

const validate = (fields, fieldsValidatorsMap) => {
    let isValid = true;

    each((value, key) => {
        const validators = fieldsValidatorsMap[key];

        validators && validators.forEach(validator => {
            if (!validator(value)) {
                isValid = false;
            }
        });
    }, fields);

    return isValid;
};

export default function saveUser (req, res) {
    try {
        const {
            name,
            surname,
            email,
            password,
            phone,
            date,
            country
        } = req.body;
        const userId = uniqid();

        getUsersCount()
            .then(count => {
                return getUserByEmail(email)
                    .then(user => {
                        if (user) {
                            return res.status(FORBIDDEN_STATUS_CODE).send({ message: 'Пользователь уже существует' });
                        }

                        const userObj = {
                            name,
                            surname,
                            email,
                            phone,
                            date,
                            id: userId,
                            password: md5(password),
                            country,
                            accountNumber: INITIAL_USER_NUMBER + count,
                            createdAt: Date.now(),
                            balance: INITIAL_BALANCE,
                            mainBalance: INITIAL_BALANCE,
                            bonuses: 0,
                            credFacilities: 0,
                            accountStatus: getStatus(INITIAL_BALANCE),
                            blocked: false,
                            isActive: 'null',
                            isVipStatus: false
                        };
                        const isUserValid = validate(userObj, userFieldsValidatorsMap);
                        if (!isUserValid) {
                            return res.status(BAD_REQUEST_STATUS_CODE).send({ error: 'Значения не являются допустимыми' });
                        }

                        return saveUserQuery(userObj)
                            .then(() => {
                                res.status(OKEY_STATUS_CODE).send(userId);

                                jsonwebtoken.sign({ id: userId }, privateKey, {
                                    algorithm: 'RS256',
                                    expiresIn: '99999y'
                                }, (err, token) => {
                                    if (err || !token) {
                                        return;
                                    }
                                    sendEmail(email, {
                                        subject: 'Спасибо за регистрацию на платформе IMEX FINANCE',
                                        content: templateEmail(
                                            name,
                                            surname,
                                            { header: 'Спасибо за регистрацию', body: 'Спасибо за регистрацию на платформе IMEX FINANCE' },
                                            token
                                        )
                                    });
                                });
                            })
                            .catch(() => {
                                res.status(SERVER_ERROR_STATUS_CODE).end();
                            });
                    });
            });
    } catch (e) {
        res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
