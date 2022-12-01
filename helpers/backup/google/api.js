import fs from 'fs';
import { google } from 'googleapis';
import readline from 'readline';

import serviceData from './constants';

export class Google {
    constructor (service) {
        this.serviceData = serviceData[service];
    }

    async init () {
        return new Promise(resolve => {
            // Load client secrets from a local file.
            fs.readFile(this.serviceData.credentialsPath, (err, content) => {
                if (err) return console.log('Error loading client secret file:', err);
                // Authorize a client with credentials, then call the Google Drive API.
                this.authorize(JSON.parse(content));
            });

            const idInterval = setInterval(() => {
                if (this.oAuth2Client) {
                    clearInterval(idInterval);
                    resolve();
                }
            }, 50);
        });
    }

    authorize (credentials, callback) {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(this.serviceData.tokenPath, (err, token) => {
            if (err) return this.getAccessToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            this.oAuth2Client = oAuth2Client;

            return callback ? callback(oAuth2Client) : '';
        });
    }

    getAccessToken (oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.serviceData.scopes
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error('Error retrieving access token', err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(this.serviceData.tokenPath, JSON.stringify(token), (err) => {
                    if (err) return console.error(err);
                    console.log('Token stored to', this.serviceData.tokenPath);
                });
                return callback ? callback(oAuth2Client) : '';
            });
        });
    }
}
