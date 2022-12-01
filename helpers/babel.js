module.exports = function (api) {
    api.cache(true);

    const presets = [
        [
            '@babel/env',
            {
                modules: 'commonjs',
                targets: {
                    node: 12
                }
            }
        ]
    ];
    const plugins = [
        '@babel/transform-runtime',
        // ['@babel/proposal-decorators', {legacy: true}],
        // ['@babel/proposal-class-properties', { loose: true }],
        '@babel/proposal-object-rest-spread',
        '@babel/syntax-dynamic-import',
        'add-module-exports',
        '@babel/plugin-proposal-class-properties',
        [
            'module-resolver',
            {
                root: ['./']
            }
        ]
    ];

    return {
        presets,
        plugins
    };
};
