import {join} from 'path';
import {oneLineTrim} from 'common-tags';
import {PackageJsonEditor, WebpackConfigEditor, install, uninstall} from '../utils';
import {allDoExist, allDoExistSync, allDoNotExist} from '../utils/common';

const DEPLOY_SCRIPTS = {
    predeploy: 'npm-run-all clean build:es build:css',
    deploy: 'echo \"Not yet implemented - now.sh or surge.sh are supported out of the box\" && exit 1'
};
const BUILD_DEPENDENCIES = [
    'cpy-cli',
    'del-cli',
    'npm-run-all'
];
const WEBPACK_DEPENDENCIES = [
    'webpack',
    'webpack-cli',
    'webpack-dashboard',
    'webpack-jarvis',
    'webpack-dev-server',
    'babel-loader',
    'terser-webpack-plugin'
];
const WEBPACK_RULES = [
    {
        test: `/\.jsx?$/`,
        exclude: `/node_modules/`,
        loader: `'babel-loader'`,
        query: {
            presets: [`'@babel/env'`]
        }
    }
];
const WEBPACK_RULES_WITH_CESIUM = [
    ...WEBPACK_RULES,
    {
        test: `/\.css$/`,
        use: [`'style-loader'`, `'css-loader'`]
    },
    {
        test: `/\.(png|gif|jpg|jpeg|svg|xml|json)$/`,
        use: [`'url-loader'`]
    }
];
const WEBPACK_PLUGINS = [
    `new DashboardPlugin()`
];
const WEBPACK_PLUGINS_WITH_CESIUM = [
    ...WEBPACK_PLUGINS,
    `new DefinePlugin({CESIUM_BASE_URL: JSON.stringify('/')})`,
    oneLineTrim`new CopyWebpackPlugin([
        {
            from: join(source, workers),
            to: 'Workers'
        },
        {
            from: join(source, 'Assets'),
            to: 'Assets'
        },
        {
            from: join(source, 'Widgets'),
            to: 'Widgets'
        }
    ])`
];
const CESIUM_ALIASES = {
    cesium$: `'cesium/Cesium'`,
    cesium: `'cesium/Source'`
};
const CESIUM_WEBPACK_DEPENDENCIES = [
    'copy-webpack-plugin',
    'css-loader',
    'style-loader',
    'url-loader'
];
const CESIUM_DEPENDENCIES = [
    ...CESIUM_WEBPACK_DEPENDENCIES,
    'cesium'
];
const RESIUM_DEPENDENCIES = [
    ...CESIUM_DEPENDENCIES,
    'resium'
];
/**
 * @type {task[]}
 * @see https://webpack.js.org/
 */
export const addWebpack = [
    {
        text: 'Create Webpack configuration file',
        task: async ({outputDirectory, port, sourceDirectory, withCesium, useReact}) => {
            const alias = {
                ...(useReact ? {'\'react-dom\'': `'@hot-loader/react-dom'`} : {}),
                ...(withCesium ? CESIUM_ALIASES : {})
            };
            const amd = {
                toUrlUndefined: true
            };
            const devServer = {
                port,
                contentBase: `'${outputDirectory}'`,
                compress: true,
                watchContentBase: true
            };
            const entryWithReact = [
                `'react-hot-loader/patch'`,
                `'${sourceDirectory}/main.js'`
            ];
            const entryWithoutReact = {
                app: `'${sourceDirectory}/main.js'`
            };
            const entry = useReact ? entryWithReact : entryWithoutReact;
            const optimization = {
                minimize: `argv.mode === 'production'`,
                minimizer: `[new TerserPlugin()]`
            };
            const node = {
                fs: `'empty'`
            };
            const plugins = withCesium ? WEBPACK_PLUGINS_WITH_CESIUM : WEBPACK_PLUGINS;
            const resolve = {
                modules: `[resolve(__dirname, '${sourceDirectory}'), 'node_modules']`,
                extensions: `[${useReact ? `'.js', '.jsx'` : `'.js'`}]`,
                alias
            };
            const rules = withCesium ? WEBPACK_RULES_WITH_CESIUM : WEBPACK_RULES;
            await (new WebpackConfigEditor())
                .create()
                .prepend(withCesium ? `const workers = '../Build/Cesium/Workers';` : '')
                .prepend(withCesium ? `const source = 'node_modules/cesium/Source';` : '')
                .prepend(`const TerserPlugin = require('terser-webpack-plugin');`)
                .prepend(`const DashboardPlugin = require('webpack-dashboard/plugin');`)
                .prepend(withCesium ? `const CopyWebpackPlugin = require('copy-webpack-plugin');` : '')
                .prepend(withCesium ? `const {DefinePlugin} = require('webpack');` : '')
                .prepend(`const {${withCesium ? 'join, ' : ''}resolve} = require('path');`)
                .prepend(`/* eslint-env node */`)
                .extend({devServer, entry, module: {rules}, optimization, plugins, resolve})
                .extend(withCesium ? {amd, node} : {})
                .commit();
        },
        condition: () => allDoNotExist('webpack.config.js')
    },
    {
        text: 'Add Webpack build tasks to package.json',
        task: async ({assetsDirectory, outputDirectory, sourceDirectory}) => {
            const scripts = {
                ...DEPLOY_SCRIPTS,
                clean: `del-cli ${outputDirectory}`,
                copy: 'npm-run-all --parallel copy:assets copy:index',
                'copy:assets': `cpy '${assetsDirectory}/!(css)/**/*.*' '${assetsDirectory}/**/[.]*' ${outputDirectory} --parents --recursive`,
                'copy:index': `cpy '${assetsDirectory}/index.html' ${outputDirectory}`,
                'prebuild:es': `del-cli ${join(outputDirectory, assetsDirectory)}`,
                'build:es': 'webpack',
                'postbuild:es': 'npm run copy',
                'watch:assets': `watch 'npm run copy' ${assetsDirectory}`,
                'watch:es': `watch 'npm run build:es' ${sourceDirectory}`,
                dashboard: 'webpack-dashboard -- webpack-dev-server --config ./webpack.config.js'
            };
            await (new PackageJsonEditor())
                .extend({scripts})
                .commit();
        },
        condition: () => allDoExist('package.json')
    },
    {
        text: 'Configure dev task',
        task: async ({skipInstall}) => {
            const scripts = {
                dev: 'stmux [ \"npm run dashboard\" : \"npm run lint:ing\" ]'
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
        text: 'Install Webpack and development dependencies',
        task: ({skipInstall}) => install([...BUILD_DEPENDENCIES, ...WEBPACK_DEPENDENCIES], {dev: true, skipInstall}),
        condition: ({isNotOffline, skipInstall}) => !skipInstall && isNotOffline && allDoExist('package.json')
    },
    {
        text: 'Install Cesium dependencies',
        task: ({skipInstall, useReact}) => install(useReact ? RESIUM_DEPENDENCIES : CESIUM_DEPENDENCIES, {skipInstall}),
        condition: ({withCesium}) => withCesium,
        optional: ({withCesium}) => withCesium
    }
];
export const removeWebpack = [
    {
        text: 'Delete Webpack configuration file',
        task: async () => {
            await (new WebpackConfigEditor())
                .delete()
                .commit();
        },
        condition: () => allDoExist('webpack.config.js')
    },
    {
        text: 'Remove Webpack build tasks from package.json',
        task: async () => {
            const scripts = {
                copy: undefined,
                'copy:assets': undefined,
                'copy:index': undefined,
                'watch:assets': undefined,
                dev: undefined,
                'prebuild:es': undefined,
                'build:es': undefined,
                'postbuild:es': undefined,
                'watch:es': undefined,
                dashboard: undefined
            };
            await (new PackageJsonEditor())
                .extend({scripts})
                .commit();
        },
        condition: () => allDoExist('package.json')
    },
    {
        text: 'Uninstall Webpack dependencies',
        task: () => uninstall([...BUILD_DEPENDENCIES, ...WEBPACK_DEPENDENCIES, 'stmux']),
        condition: ({skipInstall}) => !skipInstall && allDoExist('package.json') && (new PackageJsonEditor()).hasAll(...WEBPACK_DEPENDENCIES),
        optional: ({skipInstall}) => !skipInstall
    },
    {
        text: 'Uninstall Cesium Webpack dependencies',
        task: () => uninstall(CESIUM_WEBPACK_DEPENDENCIES),
        condition: ({skipInstall}) => !skipInstall && allDoExist('package.json') && (new PackageJsonEditor()).hasAll(...CESIUM_WEBPACK_DEPENDENCIES),
        optional: ({skipInstall, withCesium}) => !skipInstall && withCesium
    }
];
export default addWebpack;