"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.array.iterator"),require("core-js/modules/es.promise"),require("core-js/modules/es.string.split"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.Scaffolder=void 0;var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_path=require("path"),_isString=_interopRequireDefault(require("lodash/isString")),_pQueue=_interopRequireDefault(require("p-queue")),_memFs=_interopRequireDefault(require("mem-fs")),_memFsEditor=_interopRequireDefault(require("mem-fs-editor"));const{assign}=Object,silent=()=>{};/**
 * Class to create scaffolders when creating folders, and copying files/templates
 * @example
 * import {Scaffolder} from './utils';
 * const scaffolder = new Scaffolder('path/to/templates');
 * await scaffolder
 *     .target('/path/to/copy/files')
 *     .copy('foo.js')
 *     .copy('bar.js')
 *     .commit();
 */class Scaffolder{/**
     * @param {string} sourceDirectory Source directory for template files
     */constructor(a="./templates"){const b=_memFsEditor.default.create(_memFs.default.create()),c=new _pQueue.default({concurrency:1});assign(this,{copyIfExists:!1,fs:b,queue:c,sourceDirectory:a,targetDirectory:"./"})}/**
     * Set target directory
     * @param {string} targetDirectory Target directory of template files
     * @returns {Scaffolder} Chaining OK
     */target(a){return assign(this,{targetDirectory:a})}/**
     * Set overwrite flag
     * @param {boolean} flag Overwrite files (true) or not (false)
     * @returns {Scaffolder} Chaining OK
     */overwrite(a){return assign(this,{copyIfExists:a})}/**
     * Copy a file
     * @param {string} path Path string of file to be copied
     * @param {string} [filename] Name for copied file
     * @returns {Scaffolder} Chaining OK
     */copy(a,b){const c=this,{copyIfExists:d,fs:e,queue:f,sourceDirectory:g,targetDirectory:h}=c,i=(0,_path.join)(g,a),j=(0,_path.join)(process.cwd(),h,...((0,_isString.default)(b)?b:a).split("/")),k=!e.exists(j)||d;return k&&f.add(()=>e.copy(i,j)).catch(silent),c}/**
     * Write changes to disk
     * @return {Promise} Resolves when queue is empty
     */commit(){var a=this;return(0,_asyncToGenerator2.default)(function*(){const{fs:b,queue:c}=a;yield new Promise(a=>b.commit(a)),yield c.onEmpty()})()}}exports.Scaffolder=Scaffolder;var _default=Scaffolder;exports.default=_default;