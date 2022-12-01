const path = require('path');

require('@babel/register')({
    configFile: path.resolve(__dirname, '..', 'babel.js'),
    ignore: [/node_modules/],
    extensions: ['.js'],
    cache: true
});
require('./index.js');
