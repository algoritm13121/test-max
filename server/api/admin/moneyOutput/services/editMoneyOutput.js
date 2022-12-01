import {
    OKEY_STATUS_CODE,
    NOT_FOUND_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE,
    MONGODB_DUPLICATE_CODE
} from '../../../../constants/constants';

import prepareMoneyOutput from '../utils/prepareMoneyOutput';

import editMoneyOutputQuery from '../../../client/moneyOutput/queries/editMoneyOutput';

export default function editArticle (req, res) {
    try {
        const output = prepareMoneyOutput(req.body);

        editMoneyOutputQuery(output)
            .then(output => {
                res.status(OKEY_STATUS_CODE).send(output);
            })
            .catch((err) => {
                if (err.code === MONGODB_DUPLICATE_CODE) {
                    return res.status(NOT_FOUND_STATUS_CODE).send({ code: 'duplication' });
                }

                res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    } catch (e) {
        res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
