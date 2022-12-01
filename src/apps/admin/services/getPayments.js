import request from 'superagent';
import base from '../../client/services/base';

import { TOKEN_LOCAL_STORAGE_NAME } from '../constants/constants';

export default function getPayments () {
    const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);
    return () => {
        return base(
            request
                .get(`/api/admin/payment/all`)
                .query({ token })
        );
    };
}
