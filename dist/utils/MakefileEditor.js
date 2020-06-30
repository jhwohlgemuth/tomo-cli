"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.symbol.description"),require("core-js/modules/es.array.iterator"),require("core-js/modules/es.object.entries"),require("core-js/modules/es.string.replace"),require("core-js/modules/es.string.split"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.MakefileEditor=void 0;var _replace2=_interopRequireDefault(require("ramda/src/replace")),_last2=_interopRequireDefault(require("ramda/src/last")),_defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty")),_join2=_interopRequireDefault(require("ramda/src/join")),_split2=_interopRequireDefault(require("ramda/src/split")),_pipe2=_interopRequireDefault(require("ramda/src/pipe")),_fsExtra=require("fs-extra"),_createJsonEditor=_interopRequireDefault(require("./createJsonEditor")),_createModuleEditor=_interopRequireDefault(require("./createModuleEditor")),_common=require("./common");const{assign,entries}=Object,{isArray}=Array,kebabCase=(0,_pipe2.default)((0,_split2.default)(":"),(0,_join2.default)("-")),silent=()=>{},isLocalNpmCommand=(command,path=process.cwd())=>{const[packageDirectory]=path.split("Makefile"),Editor=(0,_createJsonEditor.default)("package.json"),pkg=new Editor(packageDirectory),pkgHasCommmand=pkg.hasAll(command),binHasCommand=(0,_fsExtra.existsSync)(`${(0,_common.getBinDirectory)(path)}${command}`);return pkgHasCommmand||binHasCommand};/**
 * Create and edit Makefiles. Includes ability to import package.json scripts.
 */class MakefileEditor extends(0,_createModuleEditor.default)("Makefile"){constructor(path=process.cwd()){super(path),(0,_defineProperty2.default)(this,"contents",""),(0,_defineProperty2.default)(this,"scripts",{}),(0,_defineProperty2.default)(this,"useBinVariable",!1)}write(contents){const self=this,{fs,path,queue}=self;return queue.add(()=>fs.write(path,contents)).then(()=>self.created=(0,_fsExtra.existsSync)(path)).catch(silent),assign(self,{contents})}/**
     * Append line(s) to end of Makefile
     * @param {(string|Symbol)} [lines=Symbol('skip')] Lines to append
     * @return {MakefileEditor} Chaining OK
     */append(lines=Symbol("skip")){const{contents}=this;return"symbol"==typeof lines?this:this.write(`${contents}\n${lines}`)}/**
     * Prepend line(s) to top of Makefile (similar API to {@link MakefileEditor#append})
     * @param {(string|Symbol)} [lines=Symbol('skip')] Lines to append
     * @return {MakefileEditor} Chaining OK
     */prepend(lines=Symbol("skip")){const{contents}=this;return"symbol"==typeof lines?this:this.write(`${lines}\n${contents}`)}/**
     * Format task and remove package.json dependency by replacing npm with make and such
     * @param {string} action Task action
     * @param {object} scripts Scripts object imported from package.json (must run {@link MakefileEditor#importScripts} first)
     * @return {string} Formatted action
     */formatTask(action,scripts={}){var _ref,_ref2,_action;const{path}=this,formatTaskName=(0,_pipe2.default)((0,_split2.default)(":"),(0,_join2.default)("-"),(0,_split2.default)(" "),_last2.default,(0,_replace2.default)(/["']/g,"")),formatted=(_ref=(_ref2=(_action=action,(initial=>{const matches=action.match(/['"]npm run .[^"]*['"]/g);return isArray(matches)?matches.reduce((acc,match)=>acc.replace(match,`'make ${formatTaskName(match)}'`),initial):initial})(_action)),(initial=>{const matches=action.match(/npm .* -- --.*/g),getTaskName=(0,_pipe2.default)((0,_split2.default)(" "),_last2.default);return isArray(matches)?matches.reduce((acc,match)=>{const[commands,options]=match.split(" -- ");return acc.replace(match,`${scripts[getTaskName(commands)]} ${options}`)},initial):initial})(_ref2)),(initial=>{const matches=action.match(/^npm run .*/g);return isArray(matches)?matches.reduce((acc,match)=>acc.replace(match,`$(MAKE) ${formatTaskName(match)}`),initial):initial})(_ref)),[command]=formatted.split(" "),useBinVariable=isLocalNpmCommand(command,path);return this.useBinVariable=this.useBinVariable||useBinVariable,`${useBinVariable?`$(bin)`:""}${formatted}`}/**
     * Add task to Makefile (appended to end)
     * @param {string} name Task name ("build", "lint", etc...)
     * @param {string[]} tasks Lines of code to be executed during task
     * @param {object} options Configure task
     * @param {string} [options.description] Task description used in help task
     * @param {boolean} [options.silent=false] Prepend "@" (true) or not (false)
     * @return {MakefileEditor} Chaining OK
     */addTask(name,tasks,options={description:"Task description"}){const self=this,{scripts}=self,{description}=options;return tasks.reduce((tasks,action)=>tasks.append(`\t${self.formatTask(action,scripts)}`).addTaskDescription(name,description),self.append(`${name}:`))}/**
     * Add deescription to task for use during help task
     * @param {string} task Task name
     * @param {string} description Description text
     * @example
     * const makefile = await (new MakefileEditor())
     *     .addTask('foo', 'echo foo')
     *     .commit();
     * // foo: ## Task description <-- default task description
     * //     echo foo
     * //
     * await makefile
     *     .addTaskDescription('foo', 'This task does foo')
     *     .commit();
     * // foo: ## This task does foo
     * //     echo foo
     * //
     * @return {MakefileEditor} Chaining OK
     */addTaskDescription(task,description="Task description"){const contents=this.contents.replace(`${kebabCase(task)}:\n`,`${kebabCase(task)}: ## ${description}\n`);return this.write(contents)}appendHelpTask(){return this.addTask("help",["@fgrep -h \"##\" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##/\\n    /'"],{description:"Show this help"})}/**
     * Add Makefile comment
     * @param {string} text Comment text
     * @return {MakefileEditor} Chaining OK
     */addComment(text){return this.append(`# ${text}`)}importScripts(){const{path}=this,[packageDirectory]=path.split("Makefile"),Editor=(0,_createJsonEditor.default)("package.json"),pkg=new Editor(packageDirectory).read(),{scripts}=(0,_common.parse)(pkg);return assign(this,{scripts})}/**
     * Append tasks imported from package.json
     * @example <caption>Must execute importScripts first</caption>
     * const makefile = await (new MakefileEditor())
     *     .importScripts()
     *     .appendScripts()
     *     .commit();
     * @return {MakefileEditor} Chaining OK
     */appendScripts(){const self=this,{path,scripts}=self,tasks=entries(scripts).map(([key,value])=>[kebabCase(key),[value]]),getPreTask=(tasks,name)=>{const[data]=tasks.filter(([name])=>name.startsWith("pre")).map(([name,values])=>[name.substring(3),values]).filter(task=>task[0]===name);return isArray(data)?data[1]:[]},getPostTask=(tasks,name)=>{const[data]=tasks.filter(([name])=>name.startsWith("post")).map(([name,values])=>[name.substring(4),values]).filter(task=>task[0]===name);return isArray(data)?data[1]:[]};return tasks.filter(([name])=>!(name.startsWith("pre")||name.startsWith("post"))).map(([name,values])=>[name,[...getPreTask(tasks,name),...values,...getPostTask(tasks,name)]]).reduce((tasks,[key,values])=>tasks.addTask(key,values).append(""),self.append("")).prepend(self.useBinVariable?`bin := ${(0,_common.getBinDirectory)(path)}`:Symbol("skip")).prepend(`# Built from ${path}/package.json`)}}exports.MakefileEditor=MakefileEditor;var _default=MakefileEditor;exports.default=_default;