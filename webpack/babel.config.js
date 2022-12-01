/* eslint-disable import/no-commonjs, no-console */
const fs = require('fs');
const babelrc = fs.readFileSync('./.babelrc');
const envTargets = require('../envTargets.json');

let config = {
};

try {
    config = Object.assign({
        presets: [],
        plugins: [],
        env: {}
    }, JSON.parse(babelrc));
} catch (err) {
    console.error('==>     ERROR: Error parsing .babelrc.');
    console.error(err);
}

config.plugins.splice(2, 0, 'external-helpers'); // добавляем плагин который ыносит все babel утилиты на вверх файла, но это ломает ui компоненты

module.exports = (env = 'development', esVersion = 5, modules = false) => ({
    cacheDirectory: `.tmp/babel-${process.env.SERVER ? 'server' : 'client'}`,

    presets: [
        ['env', {
            loose: true,
            modules,
            targets: envTargets[esVersion],
            include: [
                'transform-es2015-duplicate-keys',
                'transform-es2015-parameters',
                'transform-es2015-destructuring'
            ]
        }]
    ].concat(config.presets, (config.env[env] && config.env[env].presets) || []),

    plugins: [
        ['transform-runtime', { polyfill: false }]
        // ['babel-plugin-remove-attribute', { attribute: 'data-qa-tag' }]
    ].concat(config.plugins, (config.env[env] && config.env[env].plugins) || [])
});
