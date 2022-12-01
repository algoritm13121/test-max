module.exports = {
    'parser': 'babel-eslint',
    'extends': 'standard',
    'plugins': [
        'react'
    ],
    'rules': {
        'import/extensions': ['error', 'never', { 'css': 'always', 'json': 'always' }],
        'no-console': 0,
        'react/forbid-prop-types': 'off',
        'no-unused-vars': 'error',
        'import/prefer-default-export': 0,
        'react/jsx-uses-vars': 1,
        'react/jsx-uses-react': 1,
        'react/react-in-jsx-scope': 1,
        'object-curly-spacing': ['error', 'always'],
        'react/jsx-curly-brace-presence': [1, 'never'],
        'max-len': [2, 160],
        'semi': ["error", "always"],
        "indent": ["error", 4],
        "no-mixed-operators": 0,
        "react/no-unused-prop-types": 1,
        "react/prop-types": 2,
        "no-unused-expressions": 0
    },
    'env': {
        'browser': true,
        'node': true
    }
};
