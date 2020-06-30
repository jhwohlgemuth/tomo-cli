"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.array.iterator"),require("core-js/modules/es.promise"),require("core-js/modules/es.string.split"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.Scaffolder=void 0;var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_path=require("path"),_pQueue=_interopRequireDefault(require("p-queue")),_memFs=_interopRequireDefault(require("mem-fs")),_memFsEditor=_interopRequireDefault(require("mem-fs-editor"));const{assign}=Object,silent=()=>{};/**
 * Class to create scaffolders when creating folders, and copying files/templates
 * @example
 * import {Scaffolder} from './api';
 * const scaffolder = new Scaffolder('path/to/templates');
 * await scaffolder
 *     .target('/path/to/copy/files')
 *     .copy('foo.js')
 *     .copy('bar.js')
 *     .commit();
 */class Scaffolder{/**
     * @param {string} sourceDirectory Source directory for template files
     */constructor(sourceDirectory="./templates"){const fs=_memFsEditor.default.create(_memFs.default.create()),queue=new _pQueue.default({concurrency:1});assign(this,{copyIfExists:!1,fs,queue,sourceDirectory,targetDirectory:"./"})}/**
     * Set target directory
     * @param {string} targetDirectory Target directory of template files
     * @returns {Scaffolder} Chaining OK
     */target(targetDirectory){return assign(this,{targetDirectory})}/**
     * Set overwrite flag
     * @param {boolean} flag Overwrite files (true) or not (false)
     * @returns {Scaffolder} Chaining OK
     */overwrite(flag){return assign(this,{copyIfExists:flag})}/**
     * Copy a file
     * @param {string} path Path string of file to be copied
     * @param {string} [filename] Name for copied file
     * @returns {Scaffolder} Chaining OK
     */copy(path,filename){const self=this,{copyIfExists,fs,queue,sourceDirectory,targetDirectory}=self,source=(0,_path.join)(sourceDirectory,path),target=(0,_path.join)(process.cwd(),targetDirectory,...("string"==typeof filename?filename:path).split("/")),shouldCopy=!fs.exists(target)||copyIfExists;return shouldCopy&&queue.add(()=>fs.copy(source,target)).catch(silent),self}/**
     * Write changes to disk
     * @return {Promise} Resolves when queue is empty
     */commit(){var _this=this;return(0,_asyncToGenerator2.default)(function*(){const{fs,queue}=_this;yield new Promise(resolve=>fs.commit(resolve)),yield queue.onEmpty()})()}}exports.Scaffolder=Scaffolder;var _default=Scaffolder;exports.default=_default;