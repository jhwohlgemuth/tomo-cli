import {
    PackageJsonEditor,
    PurgecssConfigEditor,
    install,
    uninstall
} from '../utils';
import {allDoExist, allDoExistSync, allDoNotExist, someDoExist} from '../utils/common';

const BUILD_DEPENDENCIES = [
    'del-cli'
];
const PARCEL_DEPENDENCIES = [
    'parcel-bundler'
];
/**
 * @type {task[]}
 * @see https://parceljs.org/
 */
export const addParcel = [
    {
        text: 'Add Parcel build tasks to package.json',
        task: async ({assetsDirectory, outputDirectory}) => {
            const scripts = {
                'clean:build': `del-cli ${outputDirectory}`,
                prebuild: 'npm run clean:build',
                build: `parcel build --out-dir ${outputDirectory} --public-url ./ ${assetsDirectory}/index.html`,
                'prebuild:watch': 'npm run clean:build',
                'build:watch': `parcel watch --out-dir ${outputDirectory} --public-url ./ ${assetsDirectory}/index.html`,
                start: `parcel ${assetsDirectory}/index.html --out-dir ${outputDirectory} --open`
            };
            await (new PackageJsonEditor())
                .extend({scripts})
                .commit();
        },
        condition: () => someDoExist('package.json')
    },
    {
        text: 'Install development dependencies and add dev task to package.json',
        task: async ({skipInstall}) => {
            const scripts = {
                dev: 'stmux [ \"npm run build:watch\" : \"npm run lint:watch\" ]'
            };
            await install(['stmux'], {dev: true, skipInstall});
            await (new PackageJsonEditor())
                .extend({scripts})
                .commit();
        },
        condition: () => allDoExist('package.json', '.eslintrc.js'),
        optional: () => allDoExistSync('package.json', '.eslintrc.js')
    },
    {
        text: 'Create PurgeCSS config file',
        task: async () => {
            await (new PurgecssConfigEditor())
                .create()
                .commit();
        },
        condition: () => allDoNotExist('purgecss.config.js')
    },
    {
        text: 'Install Parcel development dependencies',
        task: ({skipInstall}) => install([...BUILD_DEPENDENCIES, ...PARCEL_DEPENDENCIES], {dev: true, skipInstall}),
        condition: ({isNotOffline}) => isNotOffline && someDoExist('package.json')
    }
];
export const removeParcel = [
    {
        text: 'Remove Parcel build tasks from package.json',
        task: async () => {
            const scripts = {
                'clean:build': undefined,
                dev: undefined,
                prebuild: undefined,
                build: undefined,
                'prebuild:watch': undefined,
                'build:watch': undefined,
                start: undefined
            };
            await (new PackageJsonEditor())
                .extend({scripts})
                .commit();
        },
        condition: () => someDoExist('package.json')
    },
    {
        text: 'Delete PurgeCSS config file',
        task: async () => {
            await (new PurgecssConfigEditor())
                .delete()
                .commit();
        },
        condition: () => someDoExist('purgecss.config.js')
    },
    {
        text: 'Uninstall Parcel dependencies',
        task: () => uninstall([...BUILD_DEPENDENCIES, ...PARCEL_DEPENDENCIES, 'stmux']),
        condition: ({skipInstall}) => !skipInstall && someDoExist('package.json') && (new PackageJsonEditor()).hasAll(...PARCEL_DEPENDENCIES),
        optional: ({skipInstall}) => !skipInstall
    }
];
export default addParcel;