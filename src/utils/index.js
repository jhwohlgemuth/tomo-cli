import execa from 'execa';
import semver from 'semver';
import first from 'lodash/first';
import {oneLineTrim} from 'common-tags';
import validate from 'validate-npm-package-name';
import {findBestMatch} from 'string-similarity';
import {dict} from './common';
import createJsonEditor from './createJsonEditor';
import createModuleEditor from './createModuleEditor';

const {keys} = Object;
/**
 * Choose tasks based on CLI options
 * @param {Object} choices Object to create choice dictionary from
 * @return {function} Accepts CLI options and returns array of tasks
 */
export const choose = choices => options => {
    const possible = keys(choices);
    const passed = keys(options);
    const lookup = dict(choices);
    const DEFAULT = lookup.has('default') ? lookup.get('default') : lookup.get(possible[0]);
    const [choice] = possible.filter(val => passed.includes(val));
    return choice ? lookup.get(choice) : DEFAULT;
};
/**
 * Use string-similarity module to determine closest matching string
 * @param {Object} commands Object with commands as key values, terms as key values for each command object
 * @param {string} command Command string input
 * @param {string[]} [terms=[]] Terms input
 * @example
 * const [intendedCommand, intendedTerms] = getIntendedInput(commands, command, terms);
 * @return {string[]} [intendedCommand, intendedTerms] Array destructed assignment is recommended (see example)
 */
export const getIntendedInput = (commands, command, terms = []) => {
    const VALID_COMMANDS = keys(commands);
    const {bestMatch: {target: intendedCommand}} = findBestMatch(command, VALID_COMMANDS);
    const VALID_TERMS = keys(commands[intendedCommand]);
    const intendedTerms = terms.map(term => findBestMatch(term, VALID_TERMS).bestMatch.target);
    return {intendedCommand, intendedTerms};
};
/**
 * Use npm CLI to return array of module versions
 * @param {string} name npm module name
 * @example
 * const versions = getVersions('react');
 * @return {string[]} Array of versions
 */
export const getVersions = async (name = '') => (name.length === 0) ? [] : (await execa('npm', ['view', name, 'versions']))
    .stdout
    .split(',\n')
    .map(str => str.match(/\d+[.]\d+[.]\d+/))
    .map(first)
    .map(semver.valid)
    .filter(Boolean);
/**
 * Install dependencies with npm
 * @param {string[]} [dependencies=[]] Modules to install
 * @param {Object} options Options to configure installation
 * @param {boolean} [options.dev=false] If true, add "--save-dev"
 * @param {boolean} [options.latest=true] If true, add "@latest" to all module names
 * @param {boolean} [options.skipInstall=false] Do not install (mostly for testing)
 * @example <caption>Install production dependencies</caption>
 * install(['react']);
 * @example <caption>Install development dependencies</caption>
 * install(['jest', 'babel-jest'], {dev: true});
 * @return {string[]} Array of inputs (mostly for testing)
 */
export const install = async (dependencies = [], options = {dev: false, latest: true, skipInstall: false}) => {
    const {dev, latest, skipInstall} = options;
    const identity = i => i;
    const concat = val => str => str + val;
    const args = ['install']
        .concat(dependencies
            .filter(name => validate(name).validForNewPackages)
            .map(latest ? concat('@latest') : identity)
        )
        .concat(dev ? '--save-dev' : []);
    skipInstall || await execa('npm', args);
    return args;
};
export const uninstall = async (dependencies = []) => {
    const args = ['uninstall'].concat(dependencies.filter(name => validate(name).validForNewPackages));
    (args.length === 1) || await execa('npm', args);
    return args;
};
/**
 * Determine if system supports Rust (necessary Rust dependencies are installed)
 * @return {boolean} Are Rust components installed?
 */
export const verifyRustInstallation = () => {

};
/**
 * Create and edit a Babel.js configuration file with a fluent API
 * @type {ModuleEditor}
 * @example <caption>Extend module.exports content and prepend text to the top of the file</caption>
 * const cfg = new BabelConfigModuleEditor();
 * await cfg
 *     .create()
 *     .extend({
 *         presets: [`'@babel/preset-env'`]
 *     })
 *     .prepend(`const {existsSync} = require('fs-extra');`)
 *     .commit();
 */
export const BabelConfigModuleEditor = createModuleEditor('babel.config.js', {
    plugins: [
        `'@babel/plugin-transform-runtime'`,
        `'@babel/plugin-proposal-class-properties'`,
        `'@babel/plugin-proposal-export-default-from'`,
        `'@babel/plugin-proposal-optional-chaining'`
    ],
    presets: [`'@babel/preset-env'`, `'minify'`]
});
/**
 * Create and edit an ESLint configuration file with a fluent API
 * @type {ModuleEditor}
 * @example
 * const cfg = new EslintConfigModuleEditor();
 * await cfg.create().commit();
 */
export const EslintConfigModuleEditor = createModuleEditor('.eslintrc.js', {
    env: {
        es6: true,
        jest: true
    },
    extends: [
        `'omaha-prime-grade'`
    ],
    parser: `'babel-eslint'`
});
/**
 * Create and edit a package.json manifest file with a fluent API
 * @type {JsonEditor}
 * @example <caption>Create a new package.json</caption>
 * const pkg = new PackageJsonEditor();
 * await pkg.create().commit();
 * @example <caption>Create a new package.json and read its contents (chaining OK)</caption>
 * const pkg = new PackageJsonEditor();
 * const contents = pkg.create().read();
 * @example <caption>Extend a package.json</caption>
 * const script = {test: 'jest --coverage'};
 * await pkg.extend({script}).commit();
 * @example <caption>Create and extend a package.json without writing to disk (chaining OK)</caption>
 * const script = {
 *     lint: 'eslint index.js -c ./.eslintrc.js'
 * };
 * await pkg
 *     .create(false)
 *     .extend({script}, false)
 *     .commit();
 */
export const PackageJsonEditor = createJsonEditor('package.json', {
    name: 'my-project',
    version: '0.0.0',
    description: 'A super cool app/server/tool/library/widget/thingy',
    license: 'MIT',
    keywords: []
});
/**
 * Create and edit an PostCSS configuration file with a fluent API
 * @type {ModuleEditor}
 * @example
 * await (new PostcssConfigEditor())
 *     .create()
 *     .commit();
 */
export const PostcssConfigEditor = createModuleEditor('postcss.config.js', {
    map: true,
    parser: `require('postcss-safe-parser')`
});
/**
 * Create and edit a Rollup configuration file with a fluent API
 * @type {ModuleEditor}
 * @example
 * await (new RollupConfigEditor())
 *     .create()
 *     .commit();
 */
export const RollupConfigEditor = createModuleEditor('rollup.config.js', {
    input: `'./src/main.js'`,
    output: {
        file: `'./dist/bundle.min.js'`,
        format: `'iife'`,
        sourceMap: `'inline'`
    },
    plugins: [
        `babel({exclude: 'node_modules/**', runtimeHelpers: true})`,
        oneLineTrim`commonjs({
            namedExports: {
                './node_modules/backbone/backbone.js': ['Model', 'history'],
                './node_modules/backbone.marionette/lib/backbone.marionette.js': ['Application', 'View', 'MnObject']
            }
        })`,
        `resolve({browser: true})`,
        `replace({'process.env.NODE_ENV': JSON.stringify('production')})`
    ]
}, {esm: true});
/**
 * Create and edit a Webpack configuration file with a fluent API
 * @type {ModuleEditor}
 * @example
 * await (new WebpackConfigEditor())
 *     .create()
 *     .commit();
 */
export const WebpackConfigEditor = createModuleEditor('webpack.config.js', {
    mode: `'development'`,
    entry: {
        app: `'./src/main.js'`
    },
    output: {
        path: `resolve('./dist')`,
        filename: `'bundle.min.js'`
    },
    module: {
        rules: [
            {
                test: `/\.js?$/`,
                exclude: `/node_modules/`,
                loader: `'babel-loader'`,
                query: {
                    presets: [`'@babel/env'`]
                }
            }
        ]
    },
    plugins: [
        `new DashboardPlugin()`
    ]
});