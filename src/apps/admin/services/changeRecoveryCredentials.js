import request from 'superagent';
import base from './base';

export default function changeRecoveryCredentials (credentials) {
    return () => base(
        request
            .post('/api/admin/authentication/recover-change')
            .send(credentials)
    );
}
