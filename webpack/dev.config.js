/* eslint-disable import/no-commonjs */
const WebpackNotifierPlugin = require('webpack-notifier');
const path = require('path');
const webpack = require('webpack');
const ExtractCssPlugin = require('extract-css-chunks-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./common.config.js');
const buildPath = path.resolve(__dirname, '..', 'public');
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 4000;
const babelConfig = require('./babel.config');

const babelLoaderConfig = babelConfig(
    'development',
    process.env.ES || 'dev'
);

const config = {
    mode: 'development',
    devtool: 'source-map',
    cache: true,
    output: {
        path: buildPath,
        publicPath: `http://${host}:${port}/public/`,
        filename: '[name].chunk.js',
        chunkFilename: '[name].chunk.js'
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
        unsafeCache: true
    },
    plugins: [
        new WebpackNotifierPlugin({
            excludeWarnings: true // убрать, была проблема с варнингом ajv
        }),
        new webpack.PrefetchPlugin('react'),
        new ExtractCssPlugin({
            filename: '[name].chunk.css',
            ignoreOrder: true
        }),
        new ProgressBarPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
};

const admin = merge.smart(common.admin, config);
const client = merge.smart(common.client, config);

module.exports = [admin, client];
