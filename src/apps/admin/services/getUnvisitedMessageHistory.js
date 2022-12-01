import request from 'superagent';
import base from './base';

import setUnvisitedMessageHistory from '../actions/setUnvisitedMessageHistory';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function getUnvisitedMessageHistory () {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .get('/api/admin/message/unvisited')
                .query({ token })
        )
            .then(history => {
                return dispatch(setUnvisitedMessageHistory(history));
            });
    };
}
