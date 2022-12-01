/* eslint-disable import/no-commonjs, global-require */
const path = require('path');
const webpack = require('webpack');
const ExtractCssPlugin = require('extract-css-chunks-webpack-plugin');
const Stylish = require('webpack-stylish');
// const CleanWebpackPlugin = require('clean-webpack-plugin');

const findPackage = require('find-package');

const postcssConfig = require('../postcssPlugins.js');
const babelConfig = require('../babel.config');

const rootPath = path.dirname(findPackage(__dirname, true).paths.absolute);
const buildPath = path.resolve(rootPath, 'server', 'compiled');
const serverPath = path.resolve(rootPath, 'server');

const cssLocalIdentName = '[name]__[local]_[hash:base64:5]';

const babelLoaderConfig = babelConfig(process.env.NODE_ENV);

let common = {
    entry: {
        server: './server/server.js'
    },
    output: {
        path: buildPath,
        publicPath: '',
        filename: 'server.js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.node']
    },
    optimization: {
        splitChunks: false,
        removeAvailableModules: false
    },
    module: {
        rules: [
            {
                test: /\.ttf$/,
                loader: 'url-loader',
                options: {
                    limit: 1000,
                    mimetype: 'application/octet-stream'
                }
            },
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
                            cacheDirectory: path.resolve('.tmp/cache-loader-server')
                        }
                    },
                    {
                        loader: 'babel-loader',
                        query: babelLoaderConfig
                    }
                ]
            },
            {
                test: /\.less$/,
                loader: 'ignore-loader'
            },
            {
                test: /\.png$/,
                loader: 'url-loader',
                options: {
                    limit: 1000,
                    mimetype: 'image/png',
                    fallback: 'file-loader',
                    // применится к лоадеру указанному в fallback (https://github.com/webpack-contrib/url-loader/issues/118#issuecomment-372314898)
                    emitFile: false
                }
            },
            {
                test: /\.jpg$/,
                loader: 'file-loader',
                options: {
                    emitFile: false
                }
            },
            {
                test: /\.svg$/,
                loader: 'raw-loader'
            },
            {
                test: /\.webp$/,
                loader: 'file-loader',
                options: {
                    emitFile: false
                }
            },
            {
                test: /\.css?$/,
                use: [
                    ExtractCssPlugin.loader,
                    {
                        loader: 'cache-loader',
                        options: {
                            cacheDirectory: path.resolve(rootPath, '.tmp/cache-loader')
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: false,
                            modules: true,
                            localIdentName: cssLocalIdentName,
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: postcssConfig
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        // new CleanWebpackPlugin(['compiled'], {
        //     root: path.join(__dirname, '..', '..', 'server')
        // }),
        new ExtractCssPlugin({
            filename: 'server.[hash].css',
            allChunks: true
        }),
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        }),
        new webpack.NormalModuleReplacementPlugin(/babel-runtime\/core-js\/promise/, path.resolve(rootPath, './utils/polyfill/promise')),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            '__dirname': JSON.stringify(serverPath)
        }),
        new Stylish()
    ],
    target: 'node',
    node: {
        'body-parser': 'empty'
    }
};

module.exports = common;
