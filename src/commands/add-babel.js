import {BabelConfigModuleEditor, PackageJsonEditor, install} from '../utils';
import {allDoNotExist, someDoExist} from '../utils/common';

const BABEL_CORE = [
    '@babel/cli',
    '@babel/core',
    '@babel/runtime'
];
const BABEL_PRESETS = [
    '@babel/preset-env',
    'babel-preset-minify'
];
const BABEL_PLUGINS = [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-optional-chaining'
];
const BABEL_REACT_PLUGINS = [
    'react-hot-loader'
];
const BABEL_REACT_PRESETS = [
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
        text: 'Add Babel build task to package.json',
        task: async ({outputDirectory, sourceDirectory}) => {
            const scripts = {
                build: `babel ${sourceDirectory} --out-dir ${outputDirectory}`,
                'build:watch': `watch 'npm run build' ${sourceDirectory}`
            };
            await (new PackageJsonEditor())
                .extend({scripts})
                .commit();

        },
        condition: () => someDoExist('package.json')
    },
    {
        text: 'Install Babel core, CLI, presets, and plugins',
        task: ({skipInstall}) => install(BABEL_DEPENDENCIES, {dev: true, skipInstall}),
        condition: ({isNotOffline}) => isNotOffline && (!(new PackageJsonEditor()).hasAll(...BABEL_DEPENDENCIES) && someDoExist('package.json'))
    },
    {
        text: 'Install Babel React presets and plugins',
        task: ({skipInstall}) => install([...BABEL_REACT_PRESETS, ...BABEL_REACT_PLUGINS], {dev: true, skipInstall}),
        condition: ({useReact}) => (useReact && someDoExist('package.json')),
        optional: ({isNotOffline, useReact}) => isNotOffline && useReact
    },
    {
        text: 'Add React support to Babel configuration file',
        task: async ({useRollup}) => {
            const addQuotes = str => `'${str}'`;
            const maybeRemove = name => (!useRollup || name !== 'react-hot-loader');
            const maybeRename = name => (name === 'react-hot-loader') ? 'react-hot-loader/babel' : name;
            const plugins = [...BABEL_PLUGINS, ...BABEL_REACT_PLUGINS].filter(maybeRemove).map(name => name |> maybeRename |> addQuotes);
            const presets = [...BABEL_PRESETS, ...BABEL_REACT_PRESETS].map(addQuotes);
            await (new BabelConfigModuleEditor())
                .extend({plugins, presets})
                .commit();
        },
        condition: ({useReact}) => useReact && someDoExist('babel.config.js'),
        optional: ({useReact}) => useReact
    }
];
export default addBabel;