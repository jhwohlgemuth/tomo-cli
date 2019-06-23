module.exports = {
    parser: 'babel-eslint',
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        }
    },
    env: {
        browser: true,
        node: true,
        es6: true,
        jest: true
    },
    extends: [
        'omaha-prime-grade',
        'plugin:react/recommended'
    ],
    globals: {
        cy: true
    },
    rules: {
        'compat/compat': 'off',
        'valid-jsdoc': 'off',
        'no-magic-numbers': ['warn', {
            ignore: [-1, 0, 1, 2, 3, 10, 100]
        }]
    },
    settings: {
        react: {
            version: '16.8'
        }
    }
};