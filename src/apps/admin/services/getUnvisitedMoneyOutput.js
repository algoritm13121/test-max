import request from 'superagent';
import base from './base';

import setUnvisitedMoneyOutput from '../actions/setUnvisitedMoneyOutput';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function getUnvisitedMoneyOutput () {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .get('/api/admin/output/unvisited')
                .query({ token })
        )
            .then(outputs => {
                return dispatch(setUnvisitedMoneyOutput(outputs));
            });
    };
}
