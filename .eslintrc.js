module.exports = {
    parser: 'babel-eslint',
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: ['react-hooks'],
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
        cy: true,
        describeOnlyOnLinux: true
    },
    rules: {
        'react/react-in-jsx-scope': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'compat/compat': 'off',
        'valid-jsdoc': 'off',
        'no-magic-numbers': ['warn', {
            ignore: [-1, 0, 1, 2, 3, 10, 100]
        }]
    },
    reportUnusedDisableDirectives: true,
    settings: {
        react: {
            version: '16.8'
        }
    }
};