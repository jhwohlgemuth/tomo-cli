import {
    PackageJsonEditor,
    WebpackConfigEditor,
    install,
    uninstall
} from '../utils';
import {allDoNotExist, someDoExist} from '../utils/common';

const WEBPACK_DEPENDENCIES = [
    'webpack',
    'webpack-cli',
    'webpack-dashboard',
    'webpack-jarvis',
    'webpack-dev-server',
    'babel-loader'
];
/**
 * @type {task[]}
 * @see https://webpack.js.org/
 */
export const addWebpack = [
    {
        text: 'Create Webpack configuration file',
        task: async ({sourceDirectory}) => {
            const entry = {
                app: `'${sourceDirectory}/main.js'`
            };
            const resolve = {
                modules: `[resolve(__dirname, '${sourceDirectory}'), 'node_modules']`
            };
            await (new WebpackConfigEditor())
                .create()
                .prepend(`const DashboardPlugin = require('webpack-dashboard/plugin');`)
                .prepend(`const {resolve} = require('path');`)
                .prepend(`/* eslint-env node */`)
                .extend({entry, resolve})
                .commit();
        },
        condition: () => allDoNotExist('webpack.config.js')
    },
    {
        text: 'Add build tasks to package.json',
        task: async () => {
            const scripts = {
                build: 'webpack',
                'build:watch': 'webpack-dashboard -- webpack-dev-server --config ./webpack.config.js'
            };
            await (new PackageJsonEditor())
                .extend({scripts})
                .commit();

        },
        condition: () => someDoExist('package.json')
    },
    {
        text: 'Install Webpack dependencies',
        task: ({skipInstall}) => install(WEBPACK_DEPENDENCIES, {dev: true, skipInstall}),
        condition: ({isNotOffline}) => isNotOffline && someDoExist('package.json')
    }
];
export const removeWebpack = [
    {
        text: 'Delete Webpack configuration file',
        task: async () => {
            await (new WebpackConfigEditor())
                .delete()
                .commit();
        },
        condition: () => someDoExist('webpack.config.js')
    },
    {
        text: 'Remove Webpack build tasks from package.json',
        task: async () => {
            const scripts = {
                build: undefined,
                'build:watch': undefined
            };
            await (new PackageJsonEditor())
                .extend({scripts})
                .commit();

        },
        condition: () => someDoExist('package.json')
    },
    {
        text: 'Uninstall Webpack dependencies',
        task: () => uninstall(WEBPACK_DEPENDENCIES),
        condition: ({skipInstall}) => !skipInstall && someDoExist('package.json') && (new PackageJsonEditor()).hasAll(...WEBPACK_DEPENDENCIES),
        optional: ({skipInstall}) => !skipInstall
    }
];
export default addWebpack;