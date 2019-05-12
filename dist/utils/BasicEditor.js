"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.array.iterator"),require("core-js/modules/es.promise"),require("core-js/modules/es.string.split"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.BasicEditor=void 0;var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_path=require("path"),_pQueue=_interopRequireDefault(require("p-queue")),_memFs=_interopRequireDefault(require("mem-fs")),_memFsEditor=_interopRequireDefault(require("mem-fs-editor"));const{assign}=Object;/**
 * Base class to serve as base for JSON and module builder classes
 */class BasicEditor{constructor(){const a=_memFsEditor.default.create(_memFs.default.create()),b=new _pQueue.default({concurrency:1});assign(this,{fs:a,queue:b})}/**
     *
     * @param {string} destination Destination to copy file
     * @return {BasicEditor} Chaining OK
     */copy(a){const b=this,{fs:c,path:d,queue:e}=b,[f]=d.split("/").reverse();return e.add(()=>c.copy(d,(0,_path.join)(a,f))),b}/**
     * @return {BasicEditor} Chaining OK
     */delete(){const a=this,{fs:b,path:c,queue:d}=a;return d.add(()=>b.delete(c)),a}done(){return this.queue.onEmpty()}/**
     * Write changes to disk
     * @return {Promise} Resolves when queue is empty
     */commit(){var a=this;return(0,_asyncToGenerator2.default)(function*(){const{fs:b}=a;yield new Promise(a=>b.commit(a)),yield a.done()})()}}exports.BasicEditor=BasicEditor;var _default=BasicEditor;exports.default=_default;