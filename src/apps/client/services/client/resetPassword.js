import request from 'superagent';
import base from '../base';

export default function resetPassword (payload) {
    return () => {
        return base(
            request
                .post('/api/client/user/reset')
                .send(payload)
        );
    };
}
