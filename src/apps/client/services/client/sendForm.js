import request from 'superagent';
import base from '../base';

export default function sendForm (payload) {
    return () => {
        return base(
            request
                .post('/api/client/form/reset')
                .send(payload)
        );
    };
}
