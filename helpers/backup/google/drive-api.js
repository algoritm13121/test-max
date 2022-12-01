import * as fs from 'fs';
import path from 'path';
import FileType from 'file-type';
import { google } from 'googleapis';

import { Google } from './api';

export class DriveApi extends Google {
    constructor () {
        super('drive');
    }

    storeFile (filePath) {
        return new Promise(async resolve => {
            const drive = google.drive({
                version: 'v3', auth: this.oAuth2Client
            });

            const fileMetadata = {
                name: path.basename(filePath)
            };
            const fileData = await FileType.fromFile(filePath);
            const media = {
                mimeType: fileData.mime,
                body: fs.createReadStream(filePath)
            };

            drive.files.create({
                // @ts-ignore
                resource: fileMetadata,
                media,
                fields: 'id'
            }, (err, file) => {
                if (err) {
                    // Handle error
                    console.error(err);
                    resolve(err);
                } else {
                    console.log('File Id: ', file.data.id);
                    resolve(file);
                }
            });
        });
    }

    upload (filePath) {
        return new Promise((resolve) => {
            const drive = google.drive({
                version: 'v3', auth: this.oAuth2Client
            });
            drive.files.list({
                fields: 'files(id, name)'
            }, (err, res) => {
                if (err) {
                    console.log(`The API returned an error: ${err}`);
                    return resolve();
                }

                const files = res.data.files;
                if (!files.length) {
                    console.log(`!files.length - google-drive-api ${filePath}`);
                    return resolve(this.storeFile(filePath));
                }

                for (const file of files) {
                    if (file.name === path.basename(filePath)) {
                        console.log(`updateFile - google-drive-api ${filePath}`);
                        return resolve(this.updateFile(file.id, filePath));
                    }
                }

                console.log(`storeFile - google-drive-api ${filePath}`);
                resolve(this.storeFile(filePath));
            });
        });
    }

    updateFile (fileId, filePath) {
        return new Promise(async (resolve) => {
            const drive = google.drive({
                version: 'v3', auth: this.oAuth2Client
            });

            // Проверка файла
            const fileMetadata = {
                name: path.basename(filePath)
            };

            const fileData = await FileType.fromFile(filePath);
            const media = {
                mimeType: fileData.mime,
                body: fs.createReadStream(filePath)
            };
            // Обновление файл
            drive.files.update({
                fileId,
                // @ts-ignore
                resource: fileMetadata,
                media
            }, (err, file) => {
                if (err) {
                    // Handle error
                    console.error(err);
                    resolve(err);
                } else {
                    console.log('File Id: ', file.data.id);
                    resolve(file);
                }
            });
        });
    }
}
