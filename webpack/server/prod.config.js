/* eslint-disable import/no-commonjs */
const path = require('path');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const common = require('./common.config.js');
const config = {
    mode: 'production',
    externals: [nodeExternals({})],
    plugins: [
        new UglifyJsPlugin({
            parallel: true,
            cache: path.resolve('.tmp/uglify'),
            uglifyOptions: {
                ecma: 5,
                mangle: false,
                compress: {
                    dead_code: true,
                    collapse_vars: false // remove after upgrade of uglify-es, https://github.com/mishoo/UglifyJS2/issues/2908
                }
            }
        })
    ]
};

module.exports = merge.smart(common, config);
