import {
    allDoNotExist,
    BabelConfigModuleEditor,
    install,
    someDoExist
} from '../utils';

const cfg = new BabelConfigModuleEditor();

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
export default [
    {
        text: 'Create Babel config file',
        task: () => cfg.create(),
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
        task: () => cfg.extend({
            presets: [...BABEL_PRESETS, ...BABEL_REACT_PRESET]
        }),
        condition: ({useReact}) => (useReact && someDoExist('babel.config.js')),
        optional: ({useReact}) => useReact
    }
];