import {
    BabelConfigModuleEditor,
    BabelConfigJsonEditor,
    PackageJsonEditor,
    SnowpackConfigEditor,
    allDoExist,
    allDoNotExist,
    install,
    someDoExist
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
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-postcss',
    '@snowpack/plugin-optimize'
];
/**
 * @type {task[]}
 * @see https://babeljs.io/
 */
export const addBabel = [
    {
        text: 'Create Babel config file',
        task: async ({useParcel}) => {
            await (useParcel ? new BabelConfigJsonEditor() : new BabelConfigModuleEditor())
                .create()
                .commit();
        },
        condition: () => allDoNotExist('babel.config.js', 'babel.config.json', '.babelrc', '.babelrc.js')
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
        task: async ({useParcel, useRollup}) => {
            const addQuotes = str => useParcel ? str : `'${str}'`;
            const maybeRemove = name => (!useRollup || name !== 'react-hot-loader');
            const maybeRename = name => (name === 'react-hot-loader') ? 'react-hot-loader/babel' : name;
            const plugins = [
                ...(useParcel ? [] : BABEL_REACT_PLUGINS),
                ...BABEL_PLUGINS
            ]
                .filter(maybeRemove)
                .map(name => name |> maybeRename |> addQuotes);
            const presets = [...BABEL_PRESETS]
                .map(addQuotes)
                .concat([useParcel ?
                    ['@babel/preset-react', {runtime: 'automatic'}] :
                    [`'@babel/preset-react'`, {runtime: `'automatic'`}]]);
            await (useParcel ? new BabelConfigJsonEditor() : new BabelConfigModuleEditor())
                .extend({plugins, presets})
                .commit();
        },
        condition: ({useReact, useSnowpack}) => useReact && !useSnowpack && someDoExist('babel.config.js', 'babel.config.json'),
        optional: ({useReact, useSnowpack}) => useReact && !useSnowpack
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
        condition: ({skipInstall, useSnowpack}) => !useSnowpack && !skipInstall && (!(new PackageJsonEditor()).hasAll(...BABEL_DEPENDENCIES) && allDoExist('package.json')), // eslint-disable-line max-len
        optional: ({useSnowpack}) => !useSnowpack
    },
    {
        text: 'Install Babel React presets and plugins',
        task: ({skipInstall, useParcel}) => install([...BABEL_REACT_PRESETS, ...(useParcel ? [] : BABEL_REACT_PLUGINS)], {dev: true, skipInstall}),
        condition: ({skipInstall, useReact, useSnowpack}) => !useSnowpack && !skipInstall && useReact && allDoExist('package.json'), // eslint-disable-line max-len
        optional: ({useReact, useSnowpack}) => useReact && !useSnowpack
    },
    {
        text: 'Install Snowpack dependencies',
        task: ({skipInstall}) => install(SNOWPACK_DEPENDENCIES, {dev: true, skipInstall}),
        condition: ({skipInstall, useSnowpack}) => !skipInstall && useSnowpack && (!(new PackageJsonEditor()).hasAll(...SNOWPACK_DEPENDENCIES) && allDoExist('package.json')), // eslint-disable-line max-len
        optional: ({useSnowpack}) => useSnowpack
    }
];
export default addBabel;