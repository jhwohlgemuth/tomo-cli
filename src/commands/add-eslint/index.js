import {join} from 'path';
import merge from 'lodash.merge';
import {
    EslintConfigModuleEditor,
    PackageJsonEditor,
    Scaffolder,
    allDoExist,
    allDoNotExist,
    allDoNotExistSync,
    install
} from '../../api';

const ESLINT_DEPENDENCIES = [
    'eslint',
    'babel-eslint',
    'eslint-config-omaha-prime-grade',
    'watch'
];
const ESLINT_REACT_PLUGINS = [
    'eslint-plugin-react'
];
const ESLINT_SETTINGS = {
    extends: [
        `'omaha-prime-grade'`
    ]
};
const REACT_ESLINT_SETTINGS = merge({}, ESLINT_SETTINGS, {
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: [`'jsx-a11y'`],
    extends: [
        `'omaha-prime-grade'`,
        `'plugin:react/recommended'`,
        `'plugin:jsx-a11y/recommended'`
    ]
});
/**
 * @type {task[]}
 * @see https://eslint.org/
 */
export const tasks = [
    {
        text: 'Create ESLint configuration and .eslintignore files',
        task: async ({overwrite}) => {
            await (new EslintConfigModuleEditor())
                .create()
                .commit();
            (allDoNotExistSync('.eslintignore') || overwrite) && await (new Scaffolder(join(__dirname, 'templates')))
                .copy('.eslintignore')
                .commit();
        },
        condition: ({overwrite}) => overwrite || allDoNotExist('.eslintrc.js', '.eslintrc', '.eslintrc.json', '.eslintrc.yml')
    },
    {
        text: 'Add lint tasks to package.json',
        task: async ({sourceDirectory}) => {
            const scripts = {
                lint: `eslint . -c ./.eslintrc.js --ext .js,.jsx --fix`,
                'lint:ing': `watch 'npm run lint' ${sourceDirectory}`,
                'lint:tests': 'eslint __tests__/**/*.js -c ./.eslintrc.js --fix --no-ignore'
            };
            await (new PackageJsonEditor())
                .extend({scripts})
                .commit();
        },
        condition: () => allDoExist('package.json')
    },
    {
        text: 'Install ESLint dependencies',
        task: ({skipInstall}) => install(ESLINT_DEPENDENCIES, {dev: true, skipInstall}),
        condition: ({skipInstall}) => !skipInstall && allDoExist('package.json')
    },
    {
        text: 'Install ESLint React plugins',
        task: ({skipInstall}) => install(ESLINT_REACT_PLUGINS, {dev: true, skipInstall}),
        condition: ({skipInstall, useReact}) => !skipInstall && useReact && allDoExist('package.json'),
        optional: ({useReact}) => useReact
    },
    {
        text: 'Add lit-html support to ESLint configuration file',
        task: async ({browser, skipInstall}) => {
            const env = {browser};
            const plugins = [`'lit'`];
            await install(['eslint-plugin-lit'], {dev: true, skipInstall});
            await (new EslintConfigModuleEditor())
                .extend(merge({}, ESLINT_SETTINGS, {env, plugins}))
                .extend({extends: [, `'plugin:lit/recommended'`]})
                .commit();
        },
        condition: ({browser, useReact}) => browser && !useReact && allDoExist('package.json', '.eslintrc.js'),
        optional: ({browser, useReact}) => browser && !useReact
    },
    {
        text: 'Add React support to ESLint configuration file',
        task: async ({browser, reactVersion, skipInstall}) => {
            const env = {browser};
            const settings = {
                react: {
                    version: `'${reactVersion}'`
                }
            };
            await install(['eslint-plugin-jsx-a11y'], {dev: true, skipInstall});
            await (new EslintConfigModuleEditor())
                .extend(merge({}, REACT_ESLINT_SETTINGS, {env, settings}))
                .commit();
        },
        condition: ({useReact}) => useReact && allDoExist('.eslintrc.js'),
        optional: ({useReact}) => useReact
    }
];
export default tasks;