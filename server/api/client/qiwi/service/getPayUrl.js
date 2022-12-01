import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';
import uniqid from 'uniqid';
import format from 'date-fns/format';
import addHours from 'date-fns/addHours';

import request from 'superagent';
import base from '../../../../../src/apps/admin/services/base';

import getTokenQuery from '../../../client/qiwi/queries/getToken';

export default function saveToken (req, res) {
    try {
        const { amount } = req.body;

        return getTokenQuery()
            .then(tokenInfo => {
                const id = uniqid();

                const expirationDateTime = addHours(Date.now(), 1);

                base(
                    request
                        .put(`https://api.qiwi.com/partner/bill/v1/bills/${id}`)
                        .set('Authorization', `Bearer ${tokenInfo.token}`)
                        .set('require', 'application/json')
                        .send({
                            amount,
                            expirationDateTime: `${format(expirationDateTime, 'yyyy-MM-dd')}T${format(expirationDateTime, 'HH:mm:ss')}`
                        })
                )
                    .then(({ payUrl }) => {
                        return res.status(OKEY_STATUS_CODE).send({ payUrl });
                    })
                    .catch(() => {
                        return res.status(SERVER_ERROR_STATUS_CODE).end();
                    });
            })
            .catch(() => {
                return res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    } catch (e) {
        return res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
