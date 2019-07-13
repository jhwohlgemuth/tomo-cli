import {join} from 'path';
import {BsConfigJsonEditor, PackageJsonEditor, install, uninstall} from '../../utils';
import {allDoExist, allDoNotExist} from '../../utils/common';
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
        text: 'Install ReasonReact dependencies',
        task: async ({skipInstall}) => {
            await install(DEPENDENCIES, {skipInstall});
            await install(DEV_DEPENDENCIES, {dev: true, skipInstall});
        },
        condition: ({isNotOffline, skipInstall}) => !skipInstall && isNotOffline && allDoExist('package.json')
    }
];
export const removeReason = [
    {
        text: 'Delete bsconfig.json file',
        task: async () => {
            await (new BsConfigJsonEditor())
                .delete()
                .commit();
        },
        condition: () => allDoExist('bsconfig.json')
    },
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