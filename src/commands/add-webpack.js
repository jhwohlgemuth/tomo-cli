import {
    allDoNotExist,
    someDoExist,
    install,
    PackageJsonEditor,
    WebpackConfigEditor
} from '../utils';

const WEBPACK_DEPENDENCIES = [
    'webpack',
    'webpack-cli',
    'webpack-dashboard',
    'webpack-jarvis',
    'webpack-dev-server'
];
/** @ignore */
export const tasks = [
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
        condition: () => someDoExist('package.json')
    }
];
export default tasks;