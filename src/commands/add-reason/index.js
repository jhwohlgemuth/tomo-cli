import {join} from 'path';
import {BsConfigJsonEditor, PackageJsonEditor, install, uninstall} from '../../utils';
import {allDoExist, allDoExistSync, allDoNotExist, allDoNotExistSync} from '../../utils/common';
import {Scaffolder} from '../../utils/Scaffolder';

const DEPENDENCIES = [
    'reason-react'
];
const DEV_DEPENDENCIES = [
    'bs-platform'
];
/**
 * @type {task[]}
 * @see https://reasonml.github.io/reason-react/en/
 */
export const addReason = [
    {
        text: 'Create bsconfig.json file',
        task: async () => {
            const {name} = (new PackageJsonEditor()).read();
            await (new BsConfigJsonEditor())
                .create()
                .extend({name})
                .commit();
        },
        condition: () => allDoNotExist('bsconfig.json')
    },
    {
        text: 'Add Reason scripts to package.json',
        task: async () => {
            const scripts = {
                'build:reason': 'bsb -make-world -clean-world',
                'watch:reason': 'npm run build:reason -- -w'
            };
            await (new PackageJsonEditor())
                .extend({scripts})
                .commit();
        },
        condition: () => allDoExist('package.json')
    },
    {
        text: 'Install ReasonReact dependencies',
        task: async ({skipInstall}) => {
            await install(DEPENDENCIES, {skipInstall});
            await install(DEV_DEPENDENCIES, {dev: true, skipInstall});
        },
        condition: () => allDoExist('package.json')
    },
    {
        text: 'Copy ReasonReact boilerplate files',
        task: async ({overwrite, sourceDirectory}) => {
            await (new Scaffolder(join(__dirname, 'templates')))
                .overwrite(overwrite)
                .target(`${sourceDirectory}/components`)
                .copy('App.re')
                .copy('Example.re')
                .commit();
        },
        condition: ({useReact}) => useReact,
        optional: ({useReact}) => useReact
    },
    {
        text: 'Configure Webpack Reason support',
        task: async () => {

        },
        condition: () => allDoExist('webpack.config.js'),
        optional: () => allDoExistSync('webpack.config.js')
    },
    {
        text: 'Configure Parcel.js Reason support',
        task: async () => {

        },
        condition: ({useParcel}) => useParcel || allDoNotExist('webpack.config.js', 'rollup.config.js'),
        optional: ({useParcel}) => useParcel || allDoNotExistSync('webpack.config.js', 'rollup.config.js')
    },
    {
        text: 'Configure Rollup.js Reason support',
        task: async () => {

        },
        condition: ({useRollup}) => useRollup || allDoExist('rollup.config.js'),
        optional: ({useRollup}) => useRollup || allDoExistSync('rollup.config.js')
    }
];
export const removeReason = [
    {
        text: 'Remove Reason scripts from package.json',
        task: async () => {
            const scripts = {
                'build:reason': undefined,
                'watch:reason': undefined
            };
            await (new PackageJsonEditor())
                .extend({scripts})
                .commit();
        },
        condition: () => allDoExist('package.json')
    },
    {
        text: 'Uninstall Reason dependencies',
        task: () => uninstall([...DEPENDENCIES, ...DEV_DEPENDENCIES]),
        condition: ({skipInstall}) => !skipInstall && allDoExist('package.json') && (new PackageJsonEditor()).hasAll(...DEPENDENCIES, ...DEV_DEPENDENCIES) // eslint-disable-line max-len
    }
];
export default addReason;