import {PackageJsonEditor, install} from '../utils';
import {allDoExist, someDoExist} from '../utils/common';

const BROWSERSYNC_DEPENDENCIES = [
    'browser-sync',
    'npm-run-all'
];
/**
 * @type {task[]}
 * @see https://www.browsersync.io/docs/command-line
 */
export const addBrowsersync = [
    {
        text: 'Add Browsersync tasks to package.json',
        task: async ({outputDirectory}) => {
            const scripts = {
                prestart: 'npm run build',
                start: 'npm-run-all --parallel build:watch build:css:watch serve:dev',
                'serve:dev': `browser-sync start --server ${outputDirectory} --files ${outputDirectory}`
            };
            await (new PackageJsonEditor())
                .extend({scripts})
                .commit();
        },
        condition: () => allDoExist('package.json', 'webpack.config.js', 'postcss.config.js')
    },
    {
        text: 'Install Browsersync dependencies',
        task: ({skipInstall}) => install(BROWSERSYNC_DEPENDENCIES, {dev: true, skipInstall}),
        condition: ({isNotOffline}) => isNotOffline && someDoExist('package.json')
    }
];