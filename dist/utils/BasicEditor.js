"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.array.iterator"),require("core-js/modules/es.promise"),require("core-js/modules/es.string.split"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.BasicEditor=void 0;var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_path=require("path"),_pQueue=_interopRequireDefault(require("p-queue")),_memFs=_interopRequireDefault(require("mem-fs")),_memFsEditor=_interopRequireDefault(require("mem-fs-editor"));const{assign}=Object;/**
 * Base class to serve as base for JSON and module builder classes
 */class BasicEditor{constructor(){const fs=_memFsEditor.default.create(_memFs.default.create()),queue=new _pQueue.default({concurrency:1});assign(this,{fs,queue})}/**
     *
     * @param {string} destination Destination to copy file
     * @return {BasicEditor} Chaining OK
     */copy(destination){const self=this,{fs,path,queue}=self,[filename]=path.split("/").reverse();return queue.add(()=>fs.copy(path,(0,_path.join)(destination,filename))),self}/**
     * @return {BasicEditor} Chaining OK
     */delete(){const self=this,{fs,path,queue}=self;return queue.add(()=>fs.delete(path)),self}done(){return this.queue.onEmpty()}/**
     * Write changes to disk
     * @return {Promise} Resolves when queue is empty
     */commit(){var _this=this;return(0,_asyncToGenerator2.default)(function*(){const{fs}=_this;yield new Promise(resolve=>fs.commit(resolve)),yield _this.done()})()}}exports.BasicEditor=BasicEditor;var _default=BasicEditor;exports.default=_default;