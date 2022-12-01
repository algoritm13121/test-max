import md5 from 'md5';
import each from '@tinkoff/utils/object/each';

import editUserQuery from '../queries/editUser';

import {
    BAD_REQUEST_STATUS_CODE,
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE
} from '../../../../constants/constants';
import { userFieldsValidatorsMap } from '../utils/fieldsAndValidation';

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

export default function editUser (req, res) {
    try {
        const {
            name,
            surname,
            email,
            password,
            phone,
            date,
            city,
            address,
            gender,
            country,
            accountNumber
        } = req.body;
        const { id } = res.locals.user;
        let personInfo = {
            name,
            surname,
            email,
            phone,
            date,
            city,
            address,
            gender,
            country,
            accountNumber,
            id,
            updatedAt: Date.now()
        };
        const isUserValid = validate(personInfo, userFieldsValidatorsMap);

        if (!isUserValid) {
            return res.status(BAD_REQUEST_STATUS_CODE).send({ error: 'Значения не являются допустимыми' });
        }

        if (password) {
            personInfo.password = md5(password);
        }

        editUserQuery(personInfo)
            .then((user) => {
                res.status(OKEY_STATUS_CODE).send(user);
            })
            .catch(() => {
                res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    } catch (e) {
        res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
