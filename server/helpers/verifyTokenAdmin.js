import jsonwebtoken from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const publicKey = fs.readFileSync(path.resolve('./server/privateKeys/adminPublicKey.ppk'), 'utf8');

export default function verifyTokenAdmin (token) {
    return new Promise((resolve, reject) => {
        if (!token) {
            console.log('jwt error 1');
            // eslint-disable-next-line prefer-promise-reject-errors
            return reject({ message: 'No token' });
        }

        jsonwebtoken.verify(token, publicKey, {
            algorithm: 'RS256'
        }, (err, data) => {
            if (err) {
                console.log('jwt error 2');
                // reject(err);
            }
            resolve(data);
        }).catch(e => {
            console.log('jwt error 3');
            console.log(e);
        });
    });
}
