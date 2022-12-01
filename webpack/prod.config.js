/* eslint-disable import/no-commonjs, global-require */

const path = require('path');
const webpack = require('webpack');
const ExtractCssPlugin = require('extract-css-chunks-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./common.config.js');
const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
const buildPath = path.resolve(__dirname, '..', 'public');
const babelConfig = require('./babel.config');
const optimizeConfig = require('./optimize.config');

const babelLoaderConfig = babelConfig('production');

let config = {
    mode: 'production',
    output: {
        path: buildPath,
        publicPath: '',
        filename: '[name].chunk.js',
        chunkFilename: '[name].chunk.js',
        jsonpFunction: 'wsp',
        crossOriginLoading: 'anonymous',
        chunkLoadTimeout: 240000 // 4 минуты
    },
    node: {
        setImmediate: false,
        process: 'mock'
    },
    module: {
        rules: [
            {
                test: /\.js[x]?$/,
                exclude: [
                    /node_modules/
                ],
                use: [
                    'thread-loader',
                    {
                        loader: 'cache-loader',
                        options: {
                            cacheDirectory: path.resolve('.tmp/cache-loader')
                        }
                    },
                    {
                        loader: 'babel-loader',
                        options: babelLoaderConfig
                    }
                ]
            }
        ]
    },
    resolve: {
        alias: {
        }
    },
    stats: 'minimal',
    plugins: [
        new ExtractCssPlugin({
            filename: '[name].chunk.css',
            allChunks: true,
            ignoreOrder: true
        }),
        new AssetsPlugin({
            filename: 'webpackAssets.json',
            update: true
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new StatsWriterPlugin()
    ]
};

config.plugins = config.plugins.concat(optimizeConfig('production'));

const admin = merge.smartStrategy({
    entry: 'prepend'
})(common.admin, config);
const client = merge.smartStrategy({
    entry: 'prepend'
})(common.client, config);

module.exports = [admin, client];
