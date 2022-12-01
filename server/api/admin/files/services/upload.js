import fs from 'fs';
import path from 'path';
import uniqid from 'uniqid';
import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE, FILES_FOLDER_PATH } from '../../../../constants/constants';

export default function updateAvatar (req, res) {
    try {
        const { dirName, name, data } = req.body;
        const fileNameParse = path.parse(name);
        const file = data.split(';base64,').pop();

        if (!fs.existsSync(FILES_FOLDER_PATH)) {
            fs.mkdirSync(FILES_FOLDER_PATH);
        }

        const dir = path.resolve(FILES_FOLDER_PATH, dirName);
        const isDirExists = fs.existsSync(dir);

        if (!isDirExists) {
            fs.mkdirSync(dir);
        }

        const resultFileName = `${fileNameParse.name}-${uniqid()}${fileNameParse.ext}`;

        fs.writeFileSync(path.resolve(dir, resultFileName), file, { encoding: 'base64' });

        res.status(OKEY_STATUS_CODE).send(`/${FILES_FOLDER_PATH}/${dirName}/${resultFileName}`);
    } catch (e) {
        return res.status(SERVER_ERROR_STATUS_CODE).end();
    }
}
