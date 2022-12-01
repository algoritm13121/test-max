import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import { FILES_FOLDER_PATH } from '../../../../constants/constants';

export default function removeFilesDir (dirName) {
    try {
        if (!fs.existsSync(FILES_FOLDER_PATH)) {
            fs.mkdirSync(FILES_FOLDER_PATH);
        }

        const dir = path.resolve(FILES_FOLDER_PATH, dirName);
        const isDirExists = fs.existsSync(dir);

        if (!isDirExists) {
            return;
        }

        rimraf.sync(dir);
    } catch (e) {}
}
