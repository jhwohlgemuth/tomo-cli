import {
    PackageJsonEditor,
    install,
    uninstall
} from '../utils';
import {allDoExist, someDoExistSync} from '../utils/common';

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
        task: async ({outputDirectory, port}) => {
            const scripts = {
                prestart: 'npm run build:es',
                start: `npm-run-all --parallel watch:es watch:css serve`,
                serve: `browser-sync start --server ${outputDirectory} --files ${outputDirectory} --port ${port}`
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
        condition: ({isNotOffline, skipInstall}) => !skipInstall && isNotOffline && allDoExist('package.json')
    }
];
export const removeBrowsersync = [
    {
        text: 'Remove Browsersync tasks from package.json',
        task: async () => {
            const scripts = {
                prestart: undefined,
                start: undefined,
                serve: undefined
            };
            await (new PackageJsonEditor())
                .extend({scripts})
                .commit();
        },
        condition: () => allDoExist('package.json')
    },
    {
        text: 'Uninstall Browsersync dependencies',
        task: () => uninstall(BROWSERSYNC_DEPENDENCIES),
        condition: ({skipInstall}) => !skipInstall && allDoExist('package.json') && (new PackageJsonEditor()).hasAll(...BROWSERSYNC_DEPENDENCIES),
        optional: ({skipInstall}) => !skipInstall
    }
];
export default addBrowsersync;