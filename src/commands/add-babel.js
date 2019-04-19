import {
    allDoNotExist,
    BabelConfigModuleEditor,
    install,
    someDoExist
} from '../utils';

const BABEL_DEPENDENCIES = [
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
/** @ignore */
export const tasks = [
    {
        text: 'Create Babel config file',
        task: async () => {
            const cfg = new BabelConfigModuleEditor();
            await cfg.create().commit();
        },
        condition: () => allDoNotExist('babel.config.js', '.babelrc', '.babelrc.js')
    },
    {
        text: 'Install Babel dependencies',
        task: ({skipInstall}) => install(BABEL_DEPENDENCIES, {dev: true, skipInstall}),
        condition: () => someDoExist('package.json')
    },
    {
        text: 'Install Babel presets',
        task: ({skipInstall}) => install(BABEL_PRESETS, {dev: true, skipInstall}),
        condition: () => someDoExist('package.json')
    },
    {
        text: 'Install Babel plugins',
        task: ({skipInstall}) => install(BABEL_PLUGINS, {dev: true, skipInstall}),
        condition: () => someDoExist('package.json')
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
            const cfg = new BabelConfigModuleEditor();
            await cfg.extend({presets}).commit();
        },
        condition: ({useReact}) => (useReact && someDoExist('babel.config.js')),
        optional: ({useReact}) => useReact
    }
];
export default tasks;