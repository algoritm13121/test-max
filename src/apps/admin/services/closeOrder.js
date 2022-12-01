import request from 'superagent';
import base from './base';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function closeOrder (order) {
    return () => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);
        return base(
            request
                .put('/api/admin/order/close')
                .send(order)
                .query({ token })
        );
    };
}
