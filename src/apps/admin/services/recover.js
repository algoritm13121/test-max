import request from 'superagent';
import base from './base';

export default function recover (email) {
    return () => base(
        request
            .get('/api/admin/authentication/recover')
            .query({ email })
    );
}
