import request from 'superagent';
import base from '../base';

export default function saveUser (user) {
    return () => {
        return base(
            request
                .post('/api/client/user/signup')
                .send(user)
        );
    };
}
