import request from 'superagent';
import base from '../base';

import setUser from '../../actions/setUser';
import { TOKEN_CLIENT_LOCAL_STORAGE_NAME } from '../../constants/constants';

export default function saveTransaction (transaction) {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_CLIENT_LOCAL_STORAGE_NAME);

        return base(
            request
                .post('/api/client/transaction/new')
                .send(transaction)
                .query({ token })
        )
            .then(payload => {
                dispatch(setUser(payload));
            });
    };
}
