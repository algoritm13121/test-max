// const babelConfig = require('../../../webpack/babel.config');
//
// process.env.SERVER = 'server';
//
// const babelLoaderConfig = babelConfig(
//     'development',
//     'dev'
// );
//
// console.log('babelLoaderConfig', babelLoaderConfig);
const path = require('path');

require('@babel/register')({
    configFile: path.resolve(__dirname, '..', 'babel.js'),
    ignore: [/node_modules/],
    extensions: ['.js'],
    cache: true
});
require('./index.js');
