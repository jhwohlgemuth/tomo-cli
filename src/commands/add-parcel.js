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
    'parcel-bundler',
    'parcel-plugin-purgecss'
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
                'prebuild:es': 'npm run clean:build',
                'build:es': `parcel build --out-dir ${outputDirectory} --public-url ./ ${assetsDirectory}/index.html`,
                'prewatch:es': 'npm run clean:build',
                'watch:es': `parcel watch --out-dir ${outputDirectory} --public-url ./ ${assetsDirectory}/index.html`,
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
                dev: 'stmux [ \"npm run watch:es\" : \"npm run lint:ing\" ]'
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
        task: async ({assetsDirectory}) => {
            const content = [`'${assetsDirectory}/index.html'`];
            await (new PurgecssConfigEditor())
                .create()
                .extend({content})
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
                'prebuild:es': undefined,
                'build:es': undefined,
                'prewatch:es': undefined,
                'watch:es': undefined,
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