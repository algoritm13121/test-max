import request from 'superagent';
import base from './base';

import setProductsAction from '../actions/setProducts';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function getProducts () {
    return dispatch => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        return base(
            request
                .get('/api/admin/product/all')
                .query({ token })
        )
            .then(products => {
                return dispatch(setProductsAction(products));
            });
    };
}
