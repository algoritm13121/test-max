/* eslint-disable import/no-commonjs */
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const common = require('./common.config.js');

const config = {
    mode: 'development',
    externals: [nodeExternals({})]
};

module.exports = merge.smart(common, config);
