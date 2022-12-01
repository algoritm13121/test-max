import shell from 'shelljs';

import { DriveApi } from './google/drive-api';

export class SystemBackup {
    constructor () {
        this.googleApi = new DriveApi();
    }

    async start () {
        console.log('start');
        await this.googleApi.init();
        // eslint-disable-next-line max-len
        await this.exec('tar czf /backup.tar.gz --exclude=/backup.tar.gz --exclude=/home --exclude=/media --exclude=/dev --exclude=/mnt --exclude=/proc --exclude=/sys --exclude=/tmp /');

        await this.googleApi.upload('/backup.tar.gz');

        await this.exec('rm /backup.tar.gz');

        process.exit();
    }

    exec (command) {
        const child = shell.exec(command, { async: true });
        return new Promise((resolve) => {
            child.stdout.on('end', () => {
                resolve();
            });
            child.stderr.on('end', () => {
                resolve();
            });
        });
    }
}

const app = new SystemBackup();
app.start();
