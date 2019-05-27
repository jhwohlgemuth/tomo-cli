import {PackageJsonEditor, install} from '../utils';
import {allDoExist, someDoExist, someDoExistSync} from '../utils/common';

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
                start: 'npm-run-all --parallel build:watch build:css:watch serve',
                serve: `browser-sync start --server ${outputDirectory} --files ${outputDirectory}`
            };
            await (new PackageJsonEditor())
                .extend({scripts})
                .commit();
        },
        condition: ({useParcel}) => allDoExist('package.json', 'postcss.config.js') && (someDoExistSync('webpack.config.js', 'rollup.config.js') || useParcel) // eslint-disable-line max-len
    },
    {
        text: 'Install Browsersync dependencies',
        task: ({skipInstall}) => install(BROWSERSYNC_DEPENDENCIES, {dev: true, skipInstall}),
        condition: ({isNotOffline}) => isNotOffline && someDoExist('package.json')
    }
];