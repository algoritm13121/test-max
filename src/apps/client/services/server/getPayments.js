import request from 'superagent';
import base from '../base';

import setPayments from '../../actions/setPayments';

export default function getPayments (req) {
    return dispatch => {
        const host = req.get('host');

        return base(
            request
                .get(`${host}/api/admin/payment/all`)
                .timeout({
                    deadline: 2000
                })
        )
            .then(payments => {
                dispatch(setPayments(payments));
            })
            .catch(() => {
                return dispatch(setPayments([]));
            });
    };
}
