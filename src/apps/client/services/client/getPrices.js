import request from 'superagent';
import base from '../base';

export default function getPrices () {
    return () => {
        return base(
            request
                .get(`/api/client/data/prices`)
        );
    };
}
