"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.array.includes"),require("core-js/modules/es.array.iterator"),require("core-js/modules/es.object.get-own-property-descriptors"),require("core-js/modules/es.string.pad-start"),require("core-js/modules/es.string.split"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.populateQueue=populateQueue,exports.WebpackConfigEditor=exports.RollupConfigEditor=exports.PurgecssConfigEditor=exports.PostcssConfigEditor=exports.BsConfigJsonEditor=exports.PackageJsonEditor=exports.EslintConfigModuleEditor=exports.BabelConfigModuleEditor=exports.uninstall=exports.install=exports.showVersion=exports.getVersions=exports.debug=exports.getIntendedInput=exports.getElapsedSeconds=exports.getElapsedTime=exports.choose=exports.withOptions=exports.isValidTask=exports.isUniqueTask=void 0;var _complement2=_interopRequireDefault(require("ramda/src/complement")),_head2=_interopRequireDefault(require("ramda/src/head")),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty")),_has2=_interopRequireDefault(require("ramda/src/has")),_os=require("os"),_path=require("path"),_util=require("util"),_fsExtra=require("fs-extra"),_execa=_interopRequireDefault(require("execa")),_pQueue=_interopRequireDefault(require("p-queue")),_semver=_interopRequireDefault(require("semver")),_readPkgUp=_interopRequireDefault(require("read-pkg-up")),_isOnline=_interopRequireDefault(require("is-online")),_commonTags=require("common-tags"),_validateNpmPackageName=_interopRequireDefault(require("validate-npm-package-name")),_stringSimilarity=require("string-similarity"),_common=require("./common"),_createJsonEditor=_interopRequireDefault(require("./createJsonEditor")),_createModuleEditor=require("./createModuleEditor");function ownKeys(a,b){var c=Object.keys(a);if(Object.getOwnPropertySymbols){var d=Object.getOwnPropertySymbols(a);b&&(d=d.filter(function(b){return Object.getOwnPropertyDescriptor(a,b).enumerable})),c.push.apply(c,d)}return c}function _objectSpread(a){for(var b,c=1;c<arguments.length;c++)b=null==arguments[c]?{}:arguments[c],c%2?ownKeys(b,!0).forEach(function(c){(0,_defineProperty2.default)(a,c,b[c])}):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(b)):ownKeys(b).forEach(function(c){Object.defineProperty(a,c,Object.getOwnPropertyDescriptor(b,c))});return a}const append=(0,_util.promisify)(_fsExtra.appendFile),{assign,keys}=Object,{isArray}=Array,isUniqueTask=({text:a},b,c)=>c.map(({text:a})=>a).indexOf(a)===b;exports.isUniqueTask=isUniqueTask;const isValidTask=a=>(0,_has2.default)("text",a)&&(0,_has2.default)("task",a)&&"string"==typeof a.text&&"function"==typeof a.task;exports.isValidTask=isValidTask;const withOptions=a=>b=>_objectSpread({},b,{},a);/**
 * Choose tasks based on CLI options
 * @param {Object} choices Object to create choice dictionary from
 * @return {function} Accepts CLI options and returns array of tasks
 */exports.withOptions=withOptions;const choose=a=>b=>{const c=keys(a),d=keys(b),e=(0,_common.dict)(a),f=e.has("default")?e.get("default"):e.get(c[0]),[g]=c.filter(a=>d.includes(a)).filter(a=>b[a]);return g?e.get(g):f};/**
 * Get duration since start in "HH:MM:SS" format
 * @param {object} start Time to determine duration from
 * @param {number[]} [initial=[0,0,0]] Duration to add to returned elapsed time
 * @example <caption>Start from 30 seconds</caption>
 * const [start] = process.hrtime()
 * const duration = getElapsedTime(start, [0, 0, 30]);
 * @return {string} Elapsed duration in format, "HH:MM:SS"
 */exports.choose=choose;const getElapsedTime=(a,b=[0,0,0])=>{var c=Math.floor;const d=60,e=b[0]*d*60+b[1]*60+b[2],f=process.hrtime()[0]+e-a,g=c(f/60%d),h=c(f/d/60),i=a=>a.toString().padStart(2,"0");return`${i(h)}:${i(g)}:${i(f%60)}`};/**
 * Convert elapsed duration to seconds
 * @param {string} duration Duration in format, "HH:MM:SS"
 * @return {number} Elapsed duration in seconds
 */exports.getElapsedTime=getElapsedTime;const getElapsedSeconds=a=>a.split(":").map(Number).reverse().reduce((a,b,c)=>Math.pow(60,c)*b+a,0);// eslint-disable-line no-magic-numbers
/**
 * Use string-similarity module to determine closest matching string
 * @param {Object} commands Object with commands as key values, terms as key values for each command object
 * @param {string} command Command string input
 * @param {string[]} [terms=[]] Terms input
 * @example
 * const [intendedCommand, intendedTerms] = getIntendedInput(commands, command, terms);
 * @return {string[]} [intendedCommand, intendedTerms] Array destructed assignment is recommended (see example)
 */exports.getElapsedSeconds=getElapsedSeconds;const getIntendedInput=(a,b,c=[])=>{const d=keys(a),{bestMatch:{target:e}}=(0,_stringSimilarity.findBestMatch)(b,d),f=keys(a[e]),g=c.map(a=>(0,_stringSimilarity.findBestMatch)(a,f).bestMatch.target);return{intendedCommand:e,intendedTerms:g}};/**
 * Append debug message to project-specific log file
 * @param {*} data Data to be stringified in log
 * @param {object} options Configuration options for function
 * @param {string} [options.filename=''] Name for debug file
 * @param {string} [options.title=''] Log title next to time stamp
 * @return {undefined} no return
 */exports.getIntendedInput=getIntendedInput;const debug=/*#__PURE__*/function(){var a=(0,_asyncToGenerator2.default)(function*(a,b={}){const{filename:c,title:d}=b,e=(0,_path.join)((0,_os.homedir)(),`.${c||"tomo-cli-run"}`),[f]=new Date().toISOString().split("T"),g=new Date().toLocaleTimeString("en-US",{hour12:!1});try{yield(0,_fsExtra.mkdirp)(e),yield append(`${e}/debug`,`[${`${f} ${g}`}] ${d||""}${_os.EOL}`),yield append(`${e}/debug`,(0,_common.format)(a)),"string"==typeof a&&0===a.length||(yield append(`${e}/debug`,_os.EOL))}catch(a){/* do nothing */}});return function(){return a.apply(this,arguments)}}();/**
 * Use npm CLI to return array of module versions
 * @param {string} name npm module name
 * @example
 * const versions = getVersions('react');
 * @return {string[]} Array of versions
 */exports.debug=debug;const getVersions=/*#__PURE__*/function(){var a=(0,_asyncToGenerator2.default)(function*(a=""){return 0===a.length?[]:(yield(0,_execa.default)("npm",["view",a,"versions"])).stdout.split(",\n").map(a=>a.match(/\d+[.]\d+[.]\d+/)).filter(isArray).map(_head2.default).map(_semver.default.valid).filter(Boolean)});return function(){return a.apply(this,arguments)}}();/**
 * Show version listed in package.json and exit
 * @return {string} Version
 */exports.getVersions=getVersions;const showVersion=()=>{const{packageJson:a}=_readPkgUp.default.sync(),{version:b}=a;// eslint-disable-line no-console
console.log(b),process.exit()};/**
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
 */exports.showVersion=showVersion;const install=/*#__PURE__*/function(){var a=(0,_asyncToGenerator2.default)(function*(a=[],b={dev:!1,latest:!0,skipInstall:!1}){const{dev:c,latest:d,skipInstall:e}=b,f=["install"].concat(a.filter(a=>(0,_validateNpmPackageName.default)(a).validForNewPackages).map(d?(a=>b=>b+a)("@latest"):a=>a)).concat(c?"--save-dev":[]);return e||(yield(0,_execa.default)("npm",f)),f});return function(){return a.apply(this,arguments)}}();exports.install=install;const uninstall=/*#__PURE__*/function(){var a=(0,_asyncToGenerator2.default)(function*(a=[]){const b=["uninstall"].concat(a.filter(a=>(0,_validateNpmPackageName.default)(a).validForNewPackages));return 1===b.length||(yield(0,_execa.default)("npm",b)),b});return function(){return a.apply(this,arguments)}}();/**
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
 */function _populateQueue(){return _populateQueue=(0,_asyncToGenerator2.default)(function*({concurrency:a=1,tasks:b=[],dispatch:c=()=>{},options:d={skipInstall:!1}}={}){const{skipInstall:e}=d,f=e||(yield(0,_isOnline.default)()),g=assign({},b.filter((0,_complement2.default)(isValidTask)).reduce((a,b)=>assign(a,b),d),{isNotOffline:f}),h=new _pQueue.default({concurrency:a});c({type:"status",payload:{online:f}});for(const[e,f]of b.filter(isValidTask).filter(isUniqueTask).entries()){const{condition:a,task:b}=f;try{(yield a(g))?yield h.add(()=>b(g)).then(()=>c({type:"complete",payload:e})).catch(()=>{c({type:"error",payload:{index:e,title:"Failed to add task to queue",location:"task",details:f.text}})}):c({type:"skipped",payload:e})}catch(a){c({type:"error",payload:{error:a,index:e,title:"Failed to test task conditions",location:"condition",details:f.text}})}}}),_populateQueue.apply(this,arguments)}const BabelConfigModuleEditor=(0,_createModuleEditor.createModuleEditor)("babel.config.js",{plugins:[`'@babel/plugin-transform-runtime'`,`'@babel/plugin-proposal-class-properties'`,`'@babel/plugin-proposal-export-default-from'`,`'@babel/plugin-proposal-optional-chaining'`],presets:[`'@babel/preset-env'`,`'babel-preset-minify'`]});/**
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
 */exports.RollupConfigEditor=RollupConfigEditor;const WebpackConfigEditor=(0,_createModuleEditor.createFunctionModuleEditor)("webpack.config.js",{mode:`argv.mode === 'production' ? 'production' : 'development'`,entry:{app:`'./src/main.js'`},devtool:`(argv.mode === 'production') ? void 0 : 'eval-source-map'`,output:{path:`resolve('./dist')`,filename:`'bundle.min.js'`}},{params:["env","argv"]});exports.WebpackConfigEditor=WebpackConfigEditor;