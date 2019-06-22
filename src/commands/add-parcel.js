import {
    PackageJsonEditor,
    PurgecssConfigEditor,
    install,
    uninstall
} from '../utils';
import {allDoExist, allDoExistSync, allDoNotExist, someDoExist} from '../utils/common';

const BUILD_DEPENDENCIES = [
    'cpy-cli',
    'del-cli',
    'npm-run-all'
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
        task: async ({assetsDirectory, outputDirectory, useReact}) => {
            const alias = {
                'react-dom': '@hot-loader/react-dom'
            };
            const scripts = {
                clean: `del-cli ${outputDirectory}`,
                copy: 'npm-run-all --parallel copy:assets copy:index',
                'copy:assets': `cpy '${assetsDirectory}/!(css)/**/*.*' '${assetsDirectory}/**/[.]*' ${outputDirectory} --parents --recursive`,
                'copy:index': `cpy '${assetsDirectory}/index.html' ${outputDirectory}`,
                'watch:assets': `watch 'npm run copy' ${assetsDirectory}`,
                'prebuild:es': 'npm run clean',
                'build:es': `parcel build --out-dir ${outputDirectory} --public-url ./ ${assetsDirectory}/index.html`,
                'prewatch:es': 'npm run clean',
                'watch:es': `parcel watch --out-dir ${outputDirectory} --public-url ./ ${assetsDirectory}/index.html`,
                serve: `parcel ${assetsDirectory}/index.html --out-dir ${outputDirectory} --open`,
                start: 'npm-run-all --parallel watch:assets serve'
            };
            await (new PackageJsonEditor())
                .extend(useReact ? {alias} : {})
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
                clean: undefined,
                copy: undefined,
                'copy:assets': undefined,
                'copy:index': undefined,
                'watch:assets': undefined,
                dev: undefined,
                'prebuild:es': undefined,
                'build:es': undefined,
                'prewatch:es': undefined,
                'watch:es': undefined,
                serve: undefined,
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