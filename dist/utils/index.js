"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.array.includes"),require("core-js/modules/es.array.iterator"),require("core-js/modules/es.string.split"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.populateQueue=populateQueue,exports.WebpackConfigEditor=exports.RollupConfigEditor=exports.PurgecssConfigEditor=exports.PostcssConfigEditor=exports.BsConfigJsonEditor=exports.PackageJsonEditor=exports.EslintConfigModuleEditor=exports.BabelConfigModuleEditor=exports.uninstall=exports.install=exports.getVersions=exports.getIntendedInput=exports.choose=exports.withOptions=exports.isValidTask=exports.isUniqueTask=void 0;var _complement2=_interopRequireDefault(require("ramda/src/complement")),_head2=_interopRequireDefault(require("ramda/src/head")),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_objectSpread2=_interopRequireDefault(require("@babel/runtime/helpers/objectSpread")),_has2=_interopRequireDefault(require("ramda/src/has")),_execa=_interopRequireDefault(require("execa")),_semver=_interopRequireDefault(require("semver")),_isOnline=_interopRequireDefault(require("is-online")),_commonTags=require("common-tags"),_validateNpmPackageName=_interopRequireDefault(require("validate-npm-package-name")),_stringSimilarity=require("string-similarity"),_common=require("./common"),_createJsonEditor=_interopRequireDefault(require("./createJsonEditor")),_createModuleEditor=require("./createModuleEditor");const{assign,keys}=Object,{isArray}=Array,isUniqueTask=({text:a},b,c)=>c.map(({text:a})=>a).indexOf(a)===b;exports.isUniqueTask=isUniqueTask;const isValidTask=a=>(0,_has2.default)("text",a)&&(0,_has2.default)("task",a)&&"string"==typeof a.text&&"function"==typeof a.task;exports.isValidTask=isValidTask;const withOptions=a=>b=>(0,_objectSpread2.default)({},b,a);/**
 * Choose tasks based on CLI options
 * @param {Object} choices Object to create choice dictionary from
 * @return {function} Accepts CLI options and returns array of tasks
 */exports.withOptions=withOptions;const choose=a=>b=>{const c=keys(a),d=keys(b),e=(0,_common.dict)(a),f=e.has("default")?e.get("default"):e.get(c[0]),[g]=c.filter(a=>d.includes(a)).filter(a=>b[a]);return g?e.get(g):f};/**
 * Use string-similarity module to determine closest matching string
 * @param {Object} commands Object with commands as key values, terms as key values for each command object
 * @param {string} command Command string input
 * @param {string[]} [terms=[]] Terms input
 * @example
 * const [intendedCommand, intendedTerms] = getIntendedInput(commands, command, terms);
 * @return {string[]} [intendedCommand, intendedTerms] Array destructed assignment is recommended (see example)
 */exports.choose=choose;const getIntendedInput=(a,b,c=[])=>{const d=keys(a),{bestMatch:{target:e}}=(0,_stringSimilarity.findBestMatch)(b,d),f=keys(a[e]),g=c.map(a=>(0,_stringSimilarity.findBestMatch)(a,f).bestMatch.target);return{intendedCommand:e,intendedTerms:g}};/**
 * Use npm CLI to return array of module versions
 * @param {string} name npm module name
 * @example
 * const versions = getVersions('react');
 * @return {string[]} Array of versions
 */exports.getIntendedInput=getIntendedInput;const getVersions=/*#__PURE__*/function(){var a=(0,_asyncToGenerator2.default)(function*(a=""){return 0===a.length?[]:(yield(0,_execa.default)("npm",["view",a,"versions"])).stdout.split(",\n").map(a=>a.match(/\d+[.]\d+[.]\d+/)).filter(isArray).map(_head2.default).map(_semver.default.valid).filter(Boolean)});return function(){return a.apply(this,arguments)}}();/**
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
 * Add async tasks to a queue, handle completion with actions dispatched via dispatch function
 * @param {Object} data Data to be used for populating queue
 * @param {Queue} [data.queue={}] p-queue instance
 * @param {Object[]} [data.tasks=[]] Array of task objects
 * @param {function} [data.dispatch=()=>{}] Function to dispatch task completion (complete, skip, error) actions
 * @param {Object} [data.options={}] Options object to pass to task function
 * @return {undefined} Returns nothing (side effects only)
 */exports.uninstall=uninstall;function populateQueue(){return _populateQueue.apply(this,arguments)}/**
 * Create and edit a Babel.js configuration file with a fluent API
 * @type {ModuleEditor}
 * @example <caption>Extend module.exports content and prepend text to the top of the file</caption>
 * await (new BabelConfigModuleEditor())
 *     .create()
 *     .extend({presets: [`'@babel/preset-env'`]})
 *     .prepend(`const {existsSync} = require('fs-extra');`)
 *     .commit();
 */function _populateQueue(){return _populateQueue=(0,_asyncToGenerator2.default)(function*(a={queue:{},tasks:[],dispatch:()=>{},options:{skipInstall:!1}}){const{queue:b,tasks:c,dispatch:d,options:e}=a,{skipInstall:f}=e,g=f||(yield(0,_isOnline.default)()),h=assign({},c.filter((0,_complement2.default)(isValidTask)).reduce((a,b)=>assign(a,b),e),{isNotOffline:g});d({type:"status",payload:{online:g}});for(const[e,f]of c.filter(isValidTask).filter(isUniqueTask).entries()){// eslint-disable-line no-unused-vars
const{condition:a,task:c}=f;try{(yield a(h))?yield b.add(()=>c(h)).then(()=>d({type:"complete",payload:e})).catch(()=>d({type:"error",payload:{index:e,title:"Failed to add task to queue",location:"task",details:f.text}})):d({type:"skipped",payload:e})}catch(a){d({type:"error",payload:{error:a,index:e,title:"Failed to test task conditions",location:"condition",details:f.text}})}}}),_populateQueue.apply(this,arguments)}const BabelConfigModuleEditor=(0,_createModuleEditor.createModuleEditor)("babel.config.js",{plugins:[`'@babel/plugin-transform-runtime'`,`'@babel/plugin-proposal-class-properties'`,`'@babel/plugin-proposal-export-default-from'`,`'@babel/plugin-proposal-optional-chaining'`],presets:[`'@babel/preset-env'`,`'babel-preset-minify'`]});/**
 * Create and edit an ESLint configuration file with a fluent API
 * @type {ModuleEditor}
 * @example
 * await (new EslintConfigModuleEditor())
 *     .create()
 *     .commit();
 */exports.BabelConfigModuleEditor=BabelConfigModuleEditor;const EslintConfigModuleEditor=(0,_createModuleEditor.createModuleEditor)(".eslintrc.js",{env:{es6:!0,jest:!0},extends:[`'omaha-prime-grade'`],parser:`'babel-eslint'`});/**
 * Create and edit a package.json manifest file with a fluent API
 * @type {JsonEditor}
 * @example <caption>Create a new package.json</caption>
 * await (new PackageJsonEditor())
 *     .create()
 *     .commit();
 * @example <caption>Create a new package.json and read its contents (chaining OK)</caption>
 * const contents = (new PackageJsonEditor())
 *     .create()
 *     .read();
 * @example <caption>Extend a package.json</caption>
 * const script = {test: 'jest --coverage'};
 * await (new PackageJsonEditor())
 *     .extend({script})
 *     .commit();
 * @example <caption>Create and extend a package.json without writing to disk (chaining OK)</caption>
 * const script = {
 *     lint: 'eslint index.js -c ./.eslintrc.js'
 * };
 * await (new PackageJsonEditor())
 *     .create(false)
 *     .extend({script}, false)
 *     .commit();
 */exports.EslintConfigModuleEditor=EslintConfigModuleEditor;const PackageJsonEditor=(0,_createJsonEditor.default)("package.json",{name:"my-project",version:"0.0.0",description:"A super cool app/server/tool/library/widget/thingy",license:"MIT",keywords:[]});exports.PackageJsonEditor=PackageJsonEditor;const BsConfigJsonEditor=(0,_createJsonEditor.default)("bsconfig.json",{"bs-dependencies":["reason-react"],"bsc-flags":["-bs-super-errors"],namespace:!0,"package-specs":[{module:"es6","in-source":!0}],"ppx-flags":[],reason:{"react-jsx":3},refmt:3,sources:[{dir:"src",subdirs:!0}],suffix:".bs.js"});/**
 * Create and edit a PostCSS configuration file with a fluent API
 * @type {ModuleEditor}
 * @example
 * await (new PostcssConfigEditor())
 *     .create()
 *     .commit();
 */exports.BsConfigJsonEditor=BsConfigJsonEditor;const PostcssConfigEditor=(0,_createModuleEditor.createModuleEditor)("postcss.config.js",{map:!0,parser:`require('postcss-safe-parser')`});/**
 * Create and edit a PurgeCSS configuration file with a fluent API
 * @type {ModuleEditor}
 * @example
 * await (new PurgecssConfigEditor())
 *     .create()
 *     .commit();
 */exports.PostcssConfigEditor=PostcssConfigEditor;const PurgecssConfigEditor=(0,_createModuleEditor.createModuleEditor)("purgecss.config.js",{content:[`'./assets/index.html'`]});/**
 * Create and edit a Rollup configuration file with a fluent API
 * @type {ModuleEditor}
 * @example
 * await (new RollupConfigEditor())
 *     .create()
 *     .commit();
 */exports.PurgecssConfigEditor=PurgecssConfigEditor;const RollupConfigEditor=(0,_createModuleEditor.createModuleEditor)("rollup.config.js",{input:`'./src/main.js'`,output:{file:`'./dist/bundle.min.js'`,format:`'iife'`,sourceMap:`'inline'`},plugins:[`babel({exclude: 'node_modules/**', runtimeHelpers: true})`,_commonTags.oneLineTrim`commonjs({
            namedExports: {
                './node_modules/backbone/backbone.js': ['Model', 'history'],
                './node_modules/backbone.marionette/lib/backbone.marionette.js': ['Application', 'View', 'MnObject']
            }
        })`,`resolve({browser: true})`,`replace({'process.env.NODE_ENV': JSON.stringify('production')})`,`terser()`]},{esm:!0});/**
 * Create and edit a Webpack configuration file with a fluent API
 * @type {ModuleEditor}
 * @example
 * await (new WebpackConfigEditor())
 *     .create()
 *     .commit();
 */exports.RollupConfigEditor=RollupConfigEditor;const WebpackConfigEditor=(0,_createModuleEditor.createFunctionModuleEditor)("webpack.config.js",{mode:`'development'`,entry:{app:`'./src/main.js'`},output:{path:`resolve('./dist')`,filename:`'bundle.min.js'`},module:{rules:[{test:`/\.jsx?$/`,exclude:`/node_modules/`,loader:`'babel-loader'`,query:{presets:[`'@babel/env'`]}}]},plugins:[`new DashboardPlugin()`]},{params:["env","argv"]});exports.WebpackConfigEditor=WebpackConfigEditor;