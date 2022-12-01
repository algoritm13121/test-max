/* eslint-disable import/no-commonjs */
const path = require('path');
const OptimizeJsPlugin = require('optimize-js-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');

module.exports = (env = 'development') => {
    const plugins = [];

    if (env === 'production') {
        plugins.push(
            new UglifyJsPlugin({
                parallel: true,
                cache: path.resolve('.tmp/uglify'),
                uglifyOptions: {
                    ecma: 5,
                    mangle: true,
                    beautify: false,
                    compress: { // remove after upgrade of uglify-es, https://github.com/mishoo/UglifyJS2/issues/2908
                        collapse_vars: false
                    },
                    output: {
                        comments: false
                    }
                }
            }),
            new OptimizeJsPlugin({
                sourceMap: false
            }),
            new CompressionPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.js$|\.css$|\.html$/,
                threshold: 10240,
                minRatio: 0.8
            }),
            new BrotliPlugin({
                asset: '[path].br[query]',
                test: /\.(js|css|html|svg)$/,
                threshold: 10240,
                minRatio: 0.8
            })
        );
    }

    return plugins;
};
