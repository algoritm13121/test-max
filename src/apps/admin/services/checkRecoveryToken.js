import request from 'superagent';
import base from './base';

export default function checkRecoveryToken ({ token, email }) {
    return () => base(
        request
            .get('/api/admin/authentication/check-recovery-token')
            .query({ token, email })
    );
}
