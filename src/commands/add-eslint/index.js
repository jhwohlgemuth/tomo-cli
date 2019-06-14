import {join} from 'path';
import {EslintConfigModuleEditor, PackageJsonEditor, install} from '../../utils';
import {allDoExist, allDoNotExist} from '../../utils/common';
import {Scaffolder} from '../../utils/Scaffolder';

const ESLINT_DEPENDENCIES = [
    'eslint',
    'babel-eslint',
    'eslint-config-omaha-prime-grade',
    'watch'
];
const ESLINT_REACT_PLUGINS = [
    'eslint-plugin-react'
];
/**
 * @type {task[]}
 * @see https://eslint.org/
 */
export const tasks = [
    {
        text: 'Create ESLint configuration and .eslintignore files',
        task: async ({browser}) => {
            const env = {browser};
            await (new EslintConfigModuleEditor())
                .create()
                .extend({env})
                .commit();
            await (new Scaffolder(join(__dirname, 'templates')))
                .copy('.eslintignore')
                .commit();
        },
        condition: () => allDoNotExist('.eslintrc.js', '.eslintrc', '.eslintrc.json', '.eslintrc.yml')
    },
    {
        text: 'Add lint tasks to package.json',
        task: async ({sourceDirectory}) => {
            const scripts = {
                lint: `eslint . -c ./.eslintrc.js --fix`,
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
        condition: ({isNotOffline}) => isNotOffline && allDoExist('package.json')
    },
    {
        text: 'Install ESLint React plugins',
        task: ({skipInstall}) => install(ESLINT_REACT_PLUGINS, {dev: true, skipInstall}),
        condition: ({isNotOffline, useReact}) => isNotOffline && useReact && allDoExist('package.json'),
        optional: ({useReact}) => useReact
    },
    {
        text: 'Add React support to ESLint configuration file',
        task: async ({reactVersion, skipInstall}) => {
            const REACT_BABEL_SETTINGS = {
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true
                    }
                },
                plugins: [`'jsx-a11y'`],
                settings: {
                    react: {
                        version: `'${reactVersion}'`
                    }
                },
                extends: [
                    `'omaha-prime-grade'`,
                    `'plugin:react/recommended'`,
                    `'plugin:jsx-a11y/recommended'`
                ]
            };
            await install(['eslint-plugin-jsx-a11y'], {dev: true, skipInstall});
            await (new EslintConfigModuleEditor())
                .extend(REACT_BABEL_SETTINGS)
                .commit();
        },
        condition: ({useReact}) => useReact && allDoExist('.eslintrc.js'),
        optional: ({useReact}) => useReact
    }
];
export default tasks;