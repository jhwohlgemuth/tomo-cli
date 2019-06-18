"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.symbol.description"),require("core-js/modules/es.array.iterator"),require("core-js/modules/es.object.entries"),require("core-js/modules/es.string.replace"),require("core-js/modules/es.string.split"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.MakefileEditor=void 0;var _replace2=_interopRequireDefault(require("ramda/src/replace")),_last2=_interopRequireDefault(require("ramda/src/last")),_defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty")),_join2=_interopRequireDefault(require("ramda/src/join")),_split2=_interopRequireDefault(require("ramda/src/split")),_pipe2=_interopRequireDefault(require("ramda/src/pipe")),_fsExtra=require("fs-extra"),_createJsonEditor=_interopRequireDefault(require("./createJsonEditor")),_createModuleEditor=_interopRequireDefault(require("./createModuleEditor")),_common=require("./common");const{assign,entries}=Object,{isArray}=Array,kebabCase=(0,_pipe2.default)((0,_split2.default)(":"),(0,_join2.default)("-")),silent=()=>{},isLocalNpmCommand=(a,b=process.cwd())=>{const[c]=b.split("Makefile"),d=(0,_createJsonEditor.default)("package.json"),e=new d(c),f=e.hasAll(a),g=(0,_fsExtra.existsSync)(`${(0,_common.getBinDirectory)(b)}${a}`);return f||g};/**
 * Create and edit Makefiles. Includes ability to import package.json scripts.
 */class MakefileEditor extends(0,_createModuleEditor.default)("Makefile"){constructor(a=process.cwd()){super(a),(0,_defineProperty2.default)(this,"contents",""),(0,_defineProperty2.default)(this,"scripts",{}),(0,_defineProperty2.default)(this,"useBinVariable",!1)}write(a){const b=this,{fs:c,path:d,queue:e}=b;return e.add(()=>c.write(d,a)).then(()=>b.created=(0,_fsExtra.existsSync)(d)).catch(silent),assign(b,{contents:a})}/**
     * Append line(s) to end of Makefile
     * @param {(string|Symbol)} [lines=Symbol('skip')] Lines to append
     * @return {MakefileEditor} Chaining OK
     */append(a=Symbol("skip")){const{contents:b}=this;return"symbol"==typeof a?this:this.write(`${b}\n${a}`)}/**
     * Prepend line(s) to top of Makefile (similar API to {@link MakefileEditor#append})
     * @param {(string|Symbol)} [lines=Symbol('skip')] Lines to append
     * @return {MakefileEditor} Chaining OK
     */prepend(a=Symbol("skip")){const{contents:b}=this;return"symbol"==typeof a?this:this.write(`${a}\n${b}`)}/**
     * Format task and remove package.json dependency by replacing npm with make and such
     * @param {string} action Task action
     * @param {object} scripts Scripts object imported from package.json (must run {@link MakefileEditor#importScripts} first)
     * @return {string} Formatted action
     */formatTask(a,b={}){var c,d,e;const{path:f}=this,g=(0,_pipe2.default)((0,_split2.default)(":"),(0,_join2.default)("-"),(0,_split2.default)(" "),_last2.default,(0,_replace2.default)(/["']/g,"")),h=(c=(d=(e=a,(b=>{const c=/['"]npm run .[^"]*['"]/g,d=a.match(c);return isArray(d)?d.reduce((a,b)=>a.replace(b,`'make ${g(b)}'`),b):b})(e)),(c=>{const d=/npm .* -- --.*/g,e=a.match(d),f=(0,_pipe2.default)((0,_split2.default)(" "),_last2.default);return isArray(e)?e.reduce((a,c)=>{const[d,e]=c.split(" -- ");return a.replace(c,`${b[f(d)]} ${e}`)},c):c})(d)),(b=>{const c=/^npm run .*/g,d=a.match(c);return isArray(d)?d.reduce((a,b)=>a.replace(b,`$(MAKE) ${g(b)}`),b):b})(c)),[i]=h.split(" "),j=isLocalNpmCommand(i,f);return this.useBinVariable=this.useBinVariable||j,`${j?`$(bin)`:""}${h}`}/**
     * Add task to Makefile (appended to end)
     * @param {string} name Task name ("build", "lint", etc...)
     * @param {string[]} tasks Lines of code to be executed during task
     * @param {object} options Configure task
     * @param {string} [options.description] Task description used in help task
     * @param {boolean} [options.silent=false] Prepend "@" (true) or not (false)
     * @return {MakefileEditor} Chaining OK
     */addTask(a,b,c={description:"Task description"}){const d=this,{scripts:e}=d,{description:f}=c;return b.reduce((b,c)=>b.append(`\t${d.formatTask(c,e)}`).addTaskDescription(a,f),d.append(`${a}:`))}/**
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
     */addTaskDescription(a,b="Task description"){const c=this.contents.replace(`${kebabCase(a)}:\n`,`${kebabCase(a)}: ## ${b}\n`);return this.write(c)}appendHelpTask(){return this.addTask("help",["@fgrep -h \"##\" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##/\\n    /'"],{description:"Show this help"})}/**
     * Add Makefile comment
     * @param {string} text Comment text
     * @return {MakefileEditor} Chaining OK
     */addComment(a){return this.append(`# ${a}`)}importScripts(){const{path:a}=this,[b]=a.split("Makefile"),c=(0,_createJsonEditor.default)("package.json"),d=new c(b).read(),{scripts:e}=(0,_common.parse)(d);return assign(this,{scripts:e})}/**
     * Append tasks imported from package.json
     * @example <caption>Must execute importScripts first</caption>
     * const makefile = await (new MakefileEditor())
     *     .importScripts()
     *     .appendScripts()
     *     .commit();
     * @return {MakefileEditor} Chaining OK
     */appendScripts(){const a=this,{path:b,scripts:c}=a,d=entries(c).map(([a,b])=>[kebabCase(a),[b]]),e=(a,b)=>{const[c]=a.filter(([a])=>a.startsWith("pre")).map(([a,b])=>[a.substring(3),b]).filter(a=>a[0]===b);return isArray(c)?c[1]:[]},f=(a,b)=>{const[c]=a.filter(([a])=>a.startsWith("post")).map(([a,b])=>[a.substring(4),b]).filter(a=>a[0]===b);return isArray(c)?c[1]:[]};return d.filter(([a])=>!(a.startsWith("pre")||a.startsWith("post"))).map(([a,b])=>[a,[...e(d,a),...b,...f(d,a)]]).reduce((a,[b,c])=>a.addTask(b,c).append(""),a.append("")).prepend(a.useBinVariable?`bin := ${(0,_common.getBinDirectory)(b)}`:Symbol("skip")).prepend(`# Built from ${b}/package.json`)}}exports.MakefileEditor=MakefileEditor;var _default=MakefileEditor;exports.default=_default;