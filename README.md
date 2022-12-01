# pl-finance

## Tech stack:

* Frontend - ReactJs, ReduxJs
* Backend - NodeJs, ExpressJs, MongoDb

## Scripts:
 * ``lint`` - linter check
 * ``lint-fix`` - linter check with --fix flag
 * ``make-backup`` - create backup in ``/backups`` folder
 * ``restore-last-dump`` - restore 1 days before backup
 * ``restore-prev-dump`` - restore 2 days before backup
 * ``static`` - start dev static server (port 4000)
 * ``server`` - start server with API (port 3000)
 * ``build:static:dev`` - build frontend bundle in dev mode
 * ``build:static:prod`` - build frontend bundle in prod mode
 * ``build:server:dev`` - build server bundle in dev mode
 * ``build:server:prod`` - build server bundle in prod mode
 * ``start:server`` - start server (port 3000)
 * ``start:dev`` - build and start server in dev mode (port 3000)
 * ``start:prod`` - build and start server in prod mode (port 3000)
 * ``start:pm2:server`` - start forever server with [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/)
 * ``start:pm2:server`` - stop forever server
 * ``deploy`` - deploy/restart app in prod mode (old server stopping, frontend and server building, starting new pm2 server)
 * ``deploy:server`` - restart prod server (without building)
 
## Pre development
 * https://www.mongodb.com/download-center/community - install MongoDb
 https://stackoverflow.com/questions/7948789/mongod-complains-that-there-is-no-data-db-folder - if you meet problems with data/db
 * ``yarn`` - install all dependencies from package.json
 * ``yarn seeds`` - fill database with test data (use one time)
 
## Local development
 * ``mongod`` - start MongoDb
 * ``yarn server`` - start server with API
 * ``yarn static`` - start dev static server (in separate terminal)
 
 http://localhost:4000/ - you can check app here
 http://localhost:4000/admin - admin panel
 
 ``admin/admin`` - login/password for admin panel
  
## Deploy
 * ``yarn deploy`` - deploy/restart app in prod mode

## VPS requirements
 * Ubuntu 20.04
 * RAM 2GB+
 
## VPS tools
### NodeJs
1. sudo apt update
2. sudo apt install nodejs
3. sudo apt install npm
4. sudo npm install -g n
5. sudo n stable
### Git
1. sudo apt update
2. sudo apt install git
### MongoDb
1. sudo apt update
2. sudo apt install -y mongodb
3. sudo systemctl status mongodb
### Yarn
1. npm i -g yarn  
### Pm2
1. npm i -g pm2
