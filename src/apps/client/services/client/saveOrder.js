import request from 'superagent';
import base from '../base';

import setUser from '../../actions/setUser';
import { TOKEN_CLIENT_LOCAL_STORAGE_NAME } from '../../constants/constants';

export default function saveOrder (order) {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_CLIENT_LOCAL_STORAGE_NAME);

        // console.log('token', token);
        // console.log('order', order);
        return base(
            request
                .post('/api/client/order/new')
                .send(order)
                .query({ token })
        )
            .then(payload => {
                dispatch(setUser(payload));
            });
    };
}
