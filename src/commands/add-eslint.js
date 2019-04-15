import {
    allDoNotExist,
    install,
    EslintConfigModuleEditor,
    PackageJsonEditor,
    someDoExist
} from '../utils';

const pkg = new PackageJsonEditor();
const cfg = new EslintConfigModuleEditor();

const ESLINT_DEPENDENCIES = [
    'eslint',
    'babel-eslint',
    'eslint-config-omaha-prime-grade',
    'watch'
];
const ESLINT_REACT_PLUGINS = [
    'eslint-plugin-react'
];
export default [
    {
        text: 'Create ESLint config file',
        task: () => cfg.create(),
        condition: () => allDoNotExist('.eslintrc.js', '.eslintrc', '.eslintrc.json', '.eslintrc.yml')
    },
    {
        text: 'Add lint tasks to package.json',
        task: ({sourceDirectory}) => pkg.extend({
            script: {
                lint: `eslint -c ./.eslintrc.js ${sourceDirectory}/**/*.js --fix`,
                'lint:watch': `watch 'npm run lint' ${sourceDirectory}`
            }
        }),
        condition: () => someDoExist('package.json')
    },
    {
        text: 'Install ESLint dependencies',
        task: ({skipInstall}) => install(ESLINT_DEPENDENCIES, {dev: true, skipInstall}),
        condition: () => someDoExist('package.json')
    },
    {
        text: 'Install ESLint React plugins',
        task: ({skipInstall}) => install(ESLINT_REACT_PLUGINS, {dev: true, skipInstall}),
        condition: ({useReact}) => (useReact && someDoExist('package.json')),
        optional: ({useReact}) => useReact
    },
    {
        text: 'Add React support to ESLint configuration file',
        task: ({reactVersion}) => cfg.extend({
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },
            settings: {
                react: {
                    version: `'${reactVersion}'`
                }
            },
            extends: ['omaha-prime-grade', 'plugin:react/recommended']
        }),
        condition: ({useReact}) => (useReact && someDoExist('.eslintrc.js')),
        optional: ({useReact}) => useReact
    }
];