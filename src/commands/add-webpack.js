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
const DEV_DEPENDENCIES = [
    'cpy-cli',
    'del-cli',
    'npm-run-all'
];
const DEPENDENCIES = [
    'webpack',
    'webpack-cli',
    'webpack-dashboard',
    'webpack-jarvis',
    'webpack-dev-server',
    'webpack-subresource-integrity',
    'babel-loader',
    'css-loader',
    'file-loader',
    'style-loader',
    'html-webpack-plugin',
    'terser-webpack-plugin',
    'webpack-bundle-analyzer'
];
const CESIUM_DEV_DEPENDENCIES = [
    'copy-webpack-plugin',
    'url-loader'
];
const WITH_RUST_DEPENDENCIES = [
    '@wasm-tool/wasm-pack-plugin'
];
const JAVASCRIPT_RULES = [
    {
        test: `/.jsx?$/`,
        exclude: `/node_modules/`,
        loader: `'babel-loader'`,
        options: {
            presets: [`'@babel/env'`]
        }
    }
];
const CSS_RULES = [
    {
        test: `/.css$/`,
        resourceQuery: `/thirdparty/`,
        use: [`'style-loader'`, `'css-loader'`]
    },
    {
        test: `/.css$/`,
        exclude: `/node_modules/`,
        use: [
            `'style-loader'`,
            {loader: `'css-loader'`, options: {importLoaders: 1}},
            `'postcss-loader'`
        ]
    }
];
const FONT_RULES = [
    {
        test: `/\\.(woff(2)?|ttf|eot|svg)(\\?v=\\d+\\.\\d+\\.\\d+)?$/`,
        use: [`'file-loader'`]
    }
];
const IMAGE_RULES = [
    {
        test: `/\.(png|gif|jpg|jpeg|svg|xml|json)$/`,
        use: [`'url-loader'`]
    }
];
const RULES = [
    ...JAVASCRIPT_RULES,
    ...CSS_RULES,
    ...FONT_RULES
];
const RULES_WITH_CESIUM = [
    ...RULES,
    ...IMAGE_RULES
];
const getAliasOption = (useReact = false) => useReact ? {'\'react-dom\'': `'@hot-loader/react-dom'`} : {};
const getDevServerOption = (outputDirectory, port) => ({
    port,
    host: `'127.0.0.1'`,
    contentBase: `'${outputDirectory}'`,
    compress: true,
    watchContentBase: true
});
const getEntryOption = (sourceDirectory, useReact = false) => {
    const entryWithReact = [
        `...(argv.mode === 'production' ? [] : ['react-hot-loader/patch'])`,
        `'${sourceDirectory}/main.jsx'`
    ];
    const entryWithoutReact = {
        app: `'${sourceDirectory}/main.js'`
    };
    return useReact ? entryWithReact : entryWithoutReact;
};
const getPlugins = ({withCesium, withRust}) => {
    const PLUGINS = [
        `new DashboardPlugin()`,
        oneLineTrim`new HtmlWebpackPlugin({
            title: \`tomo webapp [\${argv.mode === 'production' ? 'production' : 'development'}]\`, 
            template: 'assets/index.html'
        })`,
        oneLineTrim`new SriPlugin({
            hashFuncNames: ['sha256'], 
            enabled: argv.mode === 'production'
        })`
    ];
    const WITH_CESIUM = [
        `new DefinePlugin({CESIUM_BASE_URL: JSON.stringify('/')})`,
        oneLineTrim`new CopyWebpackPlugin({
            patterns: [
                {from: join(source, 'Workers'), to: 'Workers'},
                {from: join(source, 'ThirdParty'), to: 'ThirdParty'},
                {from: join(source, 'Assets'), to: 'Assets'},
                {from: join(source, 'Widgets'), to: 'Widgets'}
            ]
        })`
    ];
    const WITH_RUST = [
        oneLineTrim`new WasmPackPlugin({
            crateDirectory: resolve(__dirname, 'rust-to-wasm'),
            watchDirectories: [
                resolve(__dirname, 'rust-to-wasm', 'src'),
                resolve(__dirname, 'rust-to-wasm', 'tests')
            ],
            forceMode: argv.mode === 'production' ? 'production' : 'development'
        })`
    ];
    return [
        ...PLUGINS,
        ...(withCesium ? WITH_CESIUM : []),
        ...(withRust ? WITH_RUST : [])
    ];
};
const getResolveOption = (sourceDirectory, alias = {}, useReact = false) => ({
    mainFields: `['module', 'main']`,
    modules: `[resolve(__dirname, '${sourceDirectory}'), 'node_modules']`,
    extensions: `[${useReact ? `'.js', '.jsx'` : `'.js'`}]`,
    alias
});
const getRules = ({withCesium}) => withCesium ? RULES_WITH_CESIUM : RULES;
const iff = (condition, value) => condition ? value : undefined;
const getWebpackConfigPrependContent = ({withCesium, withRust}) => [
    `/* eslint-env node */`,
    `const {${withCesium ? 'join, ' : ''}resolve} = require('path');`,
    iff(withCesium, `const {DefinePlugin} = require('webpack');`),
    iff(withCesium, `const CopyWebpackPlugin = require('copy-webpack-plugin');`),
    `const DashboardPlugin = require('webpack-dashboard/plugin');`,
    `const HtmlWebpackPlugin = require('html-webpack-plugin');`,
    `const SriPlugin = require('webpack-subresource-integrity');`,
    `const TerserPlugin = require('terser-webpack-plugin');`,
    iff(withRust, `const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');`),
    iff(withCesium, `const source = 'node_modules/cesium/Build/Cesium';`)
]
    .reverse()// prepend puts last on top
    .filter(val => typeof val === 'string');
/**
 * @type {task[]}
 * @see https://webpack.js.org/
 */
export const addWebpack = [
    {
        text: 'Create Webpack configuration file',
        task: async ({outputDirectory, port, sourceDirectory, useReact, withCesium, withRust}) => {
            const alias = getAliasOption(useReact, withCesium);
            const context = '__dirname';
            const devServer = getDevServerOption(outputDirectory, port);
            const entry = getEntryOption(sourceDirectory, useReact);
            const node = {
                fs: `'empty'`,
                Buffer: false,
                http: `'empty'`,
                https: `'empty'`,
                zlib: `'empty'`
            };
            const optimization = {minimize: `argv.mode === 'production'`, minimizer: `[new TerserPlugin()]`};
            const plugins = getPlugins({withCesium, withRust});
            const resolve = getResolveOption(sourceDirectory, alias, useReact);
            const rules = getRules({withCesium});
            await getWebpackConfigPrependContent({withCesium, withRust})
                .reduce((config, content) => config.prepend(content), (new WebpackConfigEditor()).create())
                .extend({context, devServer, entry, module: {rules}, optimization, plugins, resolve})
                .extend(withCesium ? {node} : {})
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
                copy: 'npm-run-all --parallel copy:assets',
                'copy:assets': `cpy \"${assetsDirectory}/!(css)/**/*.*\" \"${assetsDirectory}/**/[.]*\" ${outputDirectory} --parents --recursive`,
                'prebuild:es': `del-cli ${join(outputDirectory, assetsDirectory)}`,
                'build:es': 'webpack',
                'build:stats': 'webpack --mode production --profile --json > stats.json',
                'build:analyze': 'webpack-bundle-analyzer ./stats.json',
                'postbuild:es': 'npm run copy',
                'watch:assets': `watch \"npm run copy\" ${assetsDirectory}`,
                'watch:es': `watch \"npm run build:es\" ${sourceDirectory}`,
                dashboard: 'webpack-dashboard -- webpack serve --config ./webpack.config.js'
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
        task: ({skipInstall}) => install([...DEV_DEPENDENCIES, ...DEPENDENCIES], {dev: true, skipInstall}),
        condition: ({skipInstall}) => !skipInstall && allDoExist('package.json')
    },
    {
        text: 'Install Cesium dependencies',
        task: async ({skipInstall, useReact}) => {
            const installDependencies = await install(useReact ? ['cesium', 'resium'] : ['cesium'], {skipInstall});
            const installDevelopmentDependencies = await install(CESIUM_DEV_DEPENDENCIES, {dev: true, skipInstall});
            return [installDependencies, installDevelopmentDependencies];
        },
        condition: ({skipInstall, withCesium}) => !skipInstall && withCesium,
        optional: ({withCesium}) => withCesium
    },
    {
        text: 'Install Rust dependencies',
        task: ({skipInstall}) => install(WITH_RUST_DEPENDENCIES, {dev: true, skipInstall}),
        condition: ({skipInstall, withRust}) => !skipInstall && withRust,
        optional: ({withRust}) => withRust
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
        task: () => uninstall([...DEV_DEPENDENCIES, ...DEPENDENCIES, 'stmux']),
        condition: () => allDoExist('package.json') && (new PackageJsonEditor()).hasAll(...DEPENDENCIES)
    },
    {
        text: 'Uninstall Cesium dependencies',
        task: () => uninstall(['cesium', 'resium']),
        condition: () => allDoExist('package.json') && (new PackageJsonEditor()).hasAll(['cesium']),
        optional: ({withCesium}) => withCesium
    },
    {
        text: 'Uninstall Rust Webpack dependencies',
        task: () => uninstall(WITH_RUST_DEPENDENCIES),
        condition: () => allDoExist('package.json') && (new PackageJsonEditor()).hasAll(...WITH_RUST_DEPENDENCIES),
        optional: ({withRust}) => withRust
    }
];
export default addWebpack;