"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.string.split"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.WebpackConfigEditor=exports.RollupConfigEditor=exports.PostcssConfigEditor=exports.PackageJsonEditor=exports.EslintConfigModuleEditor=exports.BabelConfigModuleEditor=exports.verifyRustInstallation=exports.uninstall=exports.install=exports.getVersions=exports.getIntendedInput=void 0;var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_execa=_interopRequireDefault(require("execa")),_semver=_interopRequireDefault(require("semver")),_first=_interopRequireDefault(require("lodash/first")),_commonTags=require("common-tags"),_validateNpmPackageName=_interopRequireDefault(require("validate-npm-package-name")),_stringSimilarity=require("string-similarity"),_createJsonEditor=_interopRequireDefault(require("./createJsonEditor")),_createModuleEditor=_interopRequireDefault(require("./createModuleEditor"));/**
 * Use string-similarity module to determine closest matching string
 * @param {Object} commands Object with commands as key values, terms as key values for each command object
 * @param {string} command Command string input
 * @param {string[]} [terms=[]] Terms input
 * @example
 * const [intendedCommand, intendedTerms] = getIntendedInput(commands, command, terms);
 * @return {string[]} [intendedCommand, intendedTerms] Array destructed assignment is recommended (see example)
 */const getIntendedInput=(a,b,c=[])=>{const d=Object.keys(a),{bestMatch:{target:e}}=(0,_stringSimilarity.findBestMatch)(b,d),f=Object.keys(a[e]),g=c.map(a=>(0,_stringSimilarity.findBestMatch)(a,f).bestMatch.target);return{intendedCommand:e,intendedTerms:g}};/**
 * Use npm CLI to return array of module versions
 * @param {string} name npm module name
 * @example
 * const versions = getVersions('react');
 * @return {string[]} Array of versions
 */exports.getIntendedInput=getIntendedInput;const getVersions=/*#__PURE__*/function(){var a=(0,_asyncToGenerator2.default)(function*(a=""){return 0===a.length?[]:(yield(0,_execa.default)("npm",["view",a,"versions"])).stdout.split(",\n").map(a=>a.match(/\d+[.]\d+[.]\d+/)).map(_first.default).map(_semver.default.valid).filter(Boolean)});return function(){return a.apply(this,arguments)}}();/**
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
 */exports.getVersions=getVersions;const install=/*#__PURE__*/function(){var a=(0,_asyncToGenerator2.default)(function*(a=[],b={dev:!1,latest:!0,skipInstall:!1}){const{dev:c,latest:d,skipInstall:e}=b,f=["install"].concat(a.filter(a=>(0,_validateNpmPackageName.default)(a).validForNewPackages).map(d?(a=>b=>b+a)("@latest"):a=>a)).concat(c?"--save-dev":[]);return e||(yield(0,_execa.default)("npm",f)),f});return function(){return a.apply(this,arguments)}}();exports.install=install;const uninstall=/*#__PURE__*/function(){var a=(0,_asyncToGenerator2.default)(function*(a=[]){const b=["uninstall"].concat(a.filter(a=>(0,_validateNpmPackageName.default)(a).validForNewPackages));return 1===b.length||(yield(0,_execa.default)("npm",b)),b});return function(){return a.apply(this,arguments)}}();/**
 * Determine if system supports Rust (necessary Rust dependencies are installed)
 * @return {boolean} Are Rust components installed?
 */exports.uninstall=uninstall;const verifyRustInstallation=()=>{};/**
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
 */exports.verifyRustInstallation=verifyRustInstallation;const BabelConfigModuleEditor=(0,_createModuleEditor.default)("babel.config.js",{plugins:[`'@babel/plugin-transform-runtime'`,`'@babel/plugin-proposal-class-properties'`,`'@babel/plugin-proposal-export-default-from'`,`'@babel/plugin-proposal-optional-chaining'`],presets:[`'@babel/preset-env'`,`'minify'`]});/**
 * Create and edit an ESLint configuration file with a fluent API
 * @type {ModuleEditor}
 * @example
 * const cfg = new EslintConfigModuleEditor();
 * await cfg.create().commit();
 */exports.BabelConfigModuleEditor=BabelConfigModuleEditor;const EslintConfigModuleEditor=(0,_createModuleEditor.default)(".eslintrc.js",{env:{es6:!0,jest:!0},extends:[`'omaha-prime-grade'`],parser:`'babel-eslint'`});/**
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
 */exports.EslintConfigModuleEditor=EslintConfigModuleEditor;const PackageJsonEditor=(0,_createJsonEditor.default)("package.json",{name:"my-project",version:"0.0.0",description:"A super cool app/server/tool/library/widget/thingy",license:"MIT",keywords:[]});/**
 * Create and edit an PostCSS configuration file with a fluent API
 * @type {ModuleEditor}
 * @example
 * await (new PostcssConfigEditor())
 *     .create()
 *     .commit();
 */exports.PackageJsonEditor=PackageJsonEditor;const PostcssConfigEditor=(0,_createModuleEditor.default)("postcss.config.js",{map:!0,parser:`require('postcss-safe-parser')`});/**
 * Create and edit a Rollup configuration file with a fluent API
 * @type {ModuleEditor}
 * @example
 * await (new RollupConfigEditor())
 *     .create()
 *     .commit();
 */exports.PostcssConfigEditor=PostcssConfigEditor;const RollupConfigEditor=(0,_createModuleEditor.default)("rollup.config.js",{input:`'./src/main.js'`,output:{file:`'./dist/bundle.min.js'`,format:`'iife'`,sourceMap:`'inline'`},plugins:[`babel({exclude: 'node_modules/**', runtimeHelpers: true})`,_commonTags.oneLineTrim`commonjs({
            namedExports: {
                './node_modules/backbone/backbone.js': ['Model', 'history'],
                './node_modules/backbone.marionette/lib/backbone.marionette.js': ['Application', 'View']
            }
        })`,`resolve({browser: true})`,`replace({'process.env.NODE_ENV': JSON.stringify('production')})`]});/**
 * Create and edit a Webpack configuration file with a fluent API
 * @type {ModuleEditor}
 * @example
 * await (new WebpackConfigEditor())
 *     .create()
 *     .commit();
 */exports.RollupConfigEditor=RollupConfigEditor;const WebpackConfigEditor=(0,_createModuleEditor.default)("webpack.config.js",{mode:`'development'`,entry:{app:`'./src/main.js'`},output:{path:`resolve('./dist')`,filename:`'bundle.min.js'`},module:{rules:[{test:`/\.js?$/`,exclude:`/node_modules/`,loader:`'babel-loader'`,query:{presets:[`'@babel/env'`]}}]},plugins:[`new DashboardPlugin()`]});exports.WebpackConfigEditor=WebpackConfigEditor;