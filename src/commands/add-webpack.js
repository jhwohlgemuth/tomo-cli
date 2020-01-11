import {join} from 'path';
import {oneLineTrim} from 'common-tags';
import {
    PackageJsonEditor,
    WebpackConfigEditor,
    allDoExist,
    allDoNotExist,
    allDoExistSync,
    debug,
    install,
    uninstall
} from '../api';

const DEPLOY_SCRIPTS = {
    predeploy: 'npm-run-all clean "build:es -- --mode=production" build:css',
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
const WEBPACK_WITH_CESIUM_DEPENDENCIES = [
    'copy-webpack-plugin',
    'css-loader',
    'style-loader',
    'url-loader'
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
const CESIUM_DEPENDENCIES = [
    ...WEBPACK_WITH_CESIUM_DEPENDENCIES,
    'cesium'
];
const RESIUM_DEPENDENCIES = [
    ...CESIUM_DEPENDENCIES,
    'resium'
];
const getAliasOption = (useReact = false, withCesium = false) => {
    const CESIUM_ALIASES = {
        cesium$: `'cesium/Cesium'`,
        cesium: `'cesium/Source'`
    };
    return {
        ...(useReact ? {'\'react-dom\'': `'@hot-loader/react-dom'`} : {}),
        ...(withCesium ? CESIUM_ALIASES : {})
    };
};
const getDevServerOption = (outputDirectory, port) => ({
    port,
    host: `'0.0.0.0'`,
    contentBase: `'${outputDirectory}'`,
    compress: true,
    watchContentBase: true
});
const getEntryOption = (sourceDirectory, useReact = false) => {
    const entryWithReact = [
        `...(argv.mode === 'production' ? [] : ['react-hot-loader/patch'])`,
        `'${sourceDirectory}/main.js'`
    ];
    const entryWithoutReact = {
        app: `'${sourceDirectory}/main.js'`
    };
    return useReact ? entryWithReact : entryWithoutReact;
};
const getResolveOption = (sourceDirectory, alias = {}, useReact = false) => ({
    modules: `[resolve(__dirname, '${sourceDirectory}'), 'node_modules']`,
    extensions: `[${useReact ? `'.js', '.jsx'` : `'.js'`}]`,
    alias
});
/*eslint-disable complexity*/
const getWebpackConfigPrependContent = withCesium => [
    `/* eslint-env node */`,
    `const {${withCesium ? 'join, ' : ''}resolve} = require('path');`,
    withCesium && `const {DefinePlugin} = require('webpack');`,
    withCesium && `const CopyWebpackPlugin = require('copy-webpack-plugin');`,
    `const DashboardPlugin = require('webpack-dashboard/plugin');`,
    `const TerserPlugin = require('terser-webpack-plugin');`,
    withCesium && `const source = 'node_modules/cesium/Source';`,
    withCesium && `const workers = '../Build/Cesium/Workers';`
]
    .reverse()// prepend puts last on top
    .filter(val => typeof val === 'string');
/*eslint-enable complexity*/
/**
 * @type {task[]}
 * @see https://webpack.js.org/
 */
export const addWebpack = [
    {
        text: 'Create Webpack configuration file',
        task: async ({outputDirectory, port, sourceDirectory, useReact, withCesium}) => {
            const alias = getAliasOption(useReact, withCesium);
            const amd = {toUrlUndefined: true};
            const devServer = getDevServerOption(outputDirectory, port);
            const entry = getEntryOption(sourceDirectory, useReact);
            const node = {fs: `'empty'`};
            const optimization = {minimize: `argv.mode === 'production'`, minimizer: `[new TerserPlugin()]`};
            const plugins = withCesium ? WEBPACK_PLUGINS_WITH_CESIUM : WEBPACK_PLUGINS;
            const resolve = getResolveOption(sourceDirectory, alias, useReact);
            const rules = withCesium ? WEBPACK_RULES_WITH_CESIUM : WEBPACK_RULES;
            await getWebpackConfigPrependContent(withCesium)
                .reduce((config, content) => config.prepend(content), (new WebpackConfigEditor()).create())
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
            try {
                await install(['stmux'], {dev: true, skipInstall});
            } catch (err) {
                await debug(err, 'Failed to install stmux');
            }
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
                dashboard: undefined,
                predeploy: undefined,
                deploy: undefined
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
        task: () => uninstall(WEBPACK_WITH_CESIUM_DEPENDENCIES),
        condition: ({skipInstall}) => !skipInstall && allDoExist('package.json') && (new PackageJsonEditor()).hasAll(...WEBPACK_WITH_CESIUM_DEPENDENCIES), //eslint-disable-line max-len
        optional: ({skipInstall, withCesium}) => !skipInstall && withCesium
    }
];
export default addWebpack;