import {
    PackageJsonEditor,
    WebpackConfigEditor,
    install
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
            await (new WebpackConfigEditor())
                .create()
                .prepend(`const DashboardPlugin = require('webpack-dashboard/plugin');`)
                .prepend(`const {resolve} = require('path');`)
                .prepend(`/* eslint-env node */`)
                .extend({entry})
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
export default addWebpack;