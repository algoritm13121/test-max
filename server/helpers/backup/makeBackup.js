const backup = require('mongodb-backup');
const path = require('path');
const format = require('date-fns/format');

const DATABASE_URL = 'mongodb://localhost/pl-finance';
const BACKUPS_FOLDER = path.join(__dirname, '..', '..', '..', 'backups');

try {
    backup({
        uri: DATABASE_URL,
        root: BACKUPS_FOLDER,
        parser: 'json',
        tar: `dump-${format(new Date(), 'yyyy-MM-dd')}.tar`
    });
} catch (e) {

}
