import request from 'superagent';
import base from '../base';

import setPayments from '../../actions/setPayments';

export default function getPayments () {
    return dispatch => {
        return base(
            request
                .get('/api/client/payments')
        )
            .then(payments => {
                dispatch(setPayments(payments));
            });
    };
}
