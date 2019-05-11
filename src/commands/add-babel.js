import {BabelConfigModuleEditor, PackageJsonEditor, install} from '../utils';
import {allDoNotExist, someDoExist} from '../utils/common';

const BABEL_CORE = [
    '@babel/cli',
    '@babel/core',
    '@babel/runtime'
];
const BABEL_PRESETS = [
    '@babel/preset-env'
];
const BABEL_PLUGINS = [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-optional-chaining'
];
const BABEL_REACT_PRESET = [
    '@babel/preset-react'
];
const BABEL_DEPENDENCIES = [
    ...BABEL_CORE,
    ...BABEL_PRESETS,
    ...BABEL_PLUGINS
];
/**
 * @type {task[]}
 * @see https://babeljs.io/
 */
export const addBabel = [
    {
        text: 'Create Babel config file',
        task: async () => {
            await (new BabelConfigModuleEditor())
                .create()
                .commit();
        },
        condition: () => allDoNotExist('babel.config.js', '.babelrc', '.babelrc.js')
    },
    {
        text: 'Install Babel core, CLI, presets, and plugins',
        task: ({skipInstall}) => install(BABEL_DEPENDENCIES, {dev: true, skipInstall}),
        condition: ({isNotOffline}) => isNotOffline && (!(new PackageJsonEditor()).hasAll(...BABEL_DEPENDENCIES) && someDoExist('package.json'))
    },
    {
        text: 'Install Babel React preset',
        task: ({skipInstall}) => install(BABEL_REACT_PRESET, {dev: true, skipInstall}),
        condition: ({useReact}) => (useReact && someDoExist('package.json')),
        optional: ({useReact}) => useReact
    },
    {
        text: 'Add React support to Babel configuration file',
        task: async () => {
            const presets = [...BABEL_PRESETS, ...BABEL_REACT_PRESET];
            await (new BabelConfigModuleEditor())
                .extend({presets})
                .commit();
        },
        condition: ({useReact}) => (useReact && someDoExist('babel.config.js')),
        optional: ({useReact}) => useReact
    }
];
export default addBabel;