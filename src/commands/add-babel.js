import {
    BabelConfigModuleEditor,
    PackageJsonEditor,
    SnowpackConfigEditor,
    allDoExist,
    allDoNotExist,
    install
} from '../api';

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
const SNOWPACK_DEPENDENCIES = [
    'snowpack',
    '@snowpack/app-scripts-react',
    '@snowpack/plugin-react-refresh'
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
        text: 'Create Snowpack config and Configure Babel for Snowpack',
        task: async ({useSnowpack}) => {
            const snowpackConfig = {
                extends: `'@snowpack/app-scripts-react/babel.config.json'`,
                plugins: `[]`,
                presets: `[]`,
                env: {
                    development: {
                        plugins: `['react-refresh/babel']`
                    }
                }
            };
            await (new SnowpackConfigEditor())
                .create()
                .commit();
            await (new BabelConfigModuleEditor())
                .extend(useSnowpack ? snowpackConfig : {})
                .commit();
        },
        condition: ({useSnowpack}) => useSnowpack && allDoExist('babel.config.js'),
        optional: ({useSnowpack}) => useSnowpack
    },
    {
        text: 'Add React support to Babel configuration file',
        task: async ({useRollup}) => {
            const addQuotes = str => `'${str}'`;
            const maybeRemove = name => (!useRollup || name !== 'react-hot-loader');
            const maybeRename = name => (name === 'react-hot-loader') ? 'react-hot-loader/babel' : name;
            const plugins = [...BABEL_REACT_PLUGINS, ...BABEL_PLUGINS].filter(maybeRemove).map(name => name |> maybeRename |> addQuotes);
            const presets = [...BABEL_PRESETS, ...BABEL_REACT_PRESETS].map(addQuotes);
            await (new BabelConfigModuleEditor())
                .extend({plugins, presets})
                .commit();
        },
        condition: ({useReact, useSnowpack}) => !useSnowpack && useReact && allDoExist('babel.config.js'),
        optional: ({useReact, useSnowpack}) => !useSnowpack && useReact
    },
    {
        text: 'Add Babel build task to package.json',
        task: async ({outputDirectory, sourceDirectory, useSnowpack}) => {
            const scripts = {
                'build:es': `babel ${sourceDirectory} --out-dir ${outputDirectory}`,
                'watch:es': `watch 'npm run build:es' ${sourceDirectory}`
            };
            await (new PackageJsonEditor())
                .extend(useSnowpack ? {scripts: {build: 'snowpack build'}} : {scripts})
                .commit();

        },
        condition: () => allDoExist('package.json')
    },
    {
        text: 'Install Babel core, CLI, presets, and plugins',
        task: ({skipInstall}) => install(BABEL_DEPENDENCIES, {dev: true, skipInstall}),
        condition: ({isNotOffline, skipInstall, useSnowpack}) => !useSnowpack && !skipInstall && isNotOffline && (!(new PackageJsonEditor()).hasAll(...BABEL_DEPENDENCIES) && allDoExist('package.json')), // eslint-disable-line max-len
        optional: ({useSnowpack}) => !useSnowpack
    },
    {
        text: 'Install Babel React presets and plugins',
        task: ({skipInstall}) => install([...BABEL_REACT_PRESETS, ...BABEL_REACT_PLUGINS], {dev: true, skipInstall}),
        condition: ({isNotOffline, skipInstall, useReact, useSnowpack}) => !useSnowpack && !skipInstall && isNotOffline && useReact && allDoExist('package.json'), // eslint-disable-line max-len
        optional: ({useReact, useSnowpack}) => !useSnowpack && useReact
    },
    {
        text: 'Install Snowpack dependencies',
        task: ({skipInstall}) => install(SNOWPACK_DEPENDENCIES, {dev: true, skipInstall}),
        condition: ({isNotOffline, skipInstall, useSnowpack}) => useSnowpack && !skipInstall && isNotOffline && (!(new PackageJsonEditor()).hasAll(...SNOWPACK_DEPENDENCIES) && allDoExist('package.json')), // eslint-disable-line max-len
        optional: ({useSnowpack}) => useSnowpack
    }
];
export default addBabel;