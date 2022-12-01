import jsonwebtoken from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const publicKey = fs.readFileSync(path.resolve('./server/privateKeys/adminPublicKey.ppk'), 'utf8');

export default function verifyTokenClient (token) {
    return new Promise((resolve, reject) => {
        if (!token) {
            // eslint-disable-next-line prefer-promise-reject-errors
            return reject({ message: 'No token' });
        }

        jsonwebtoken.verify(token, publicKey, {
            algorithm: 'RS256'
        }, (err, data) => {
            if (err) {
                // reject(err);
            }
            resolve(data);
        });
    });
}
