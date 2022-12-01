import path from 'path';

const baseShema = {
    tokenPath: '',
    credentialsPath: '',
    scopes: []
};

const serviceData = {
    drive: {
        ...baseShema
    }
};

serviceData.drive.tokenPath = path.resolve(__dirname, '..', 'keys', 'token.json');
serviceData.drive.credentialsPath = path.resolve(__dirname, '..', 'keys', 'credentials.json');

serviceData.drive.scopes.push('https://www.googleapis.com/auth/drive');

export default serviceData;
