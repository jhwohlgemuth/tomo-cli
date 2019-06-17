"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.array.iterator"),require("core-js/modules/es.object.entries"),require("core-js/modules/es.promise"),require("core-js/modules/es.string.replace"),require("core-js/modules/es.string.split"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.allDoNotExistSync=exports.allDoNotExist=exports.allDoExistSync=exports.allDoExist=exports.someDoExistSync=exports.someDoExist=exports.format=exports.getBinDirectory=exports.maybeApply=exports.parse=exports.dict=void 0;var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_is2=_interopRequireDefault(require("ramda/src/is")),_path=require("path"),_fsExtra=require("fs-extra"),_prettier=_interopRequireDefault(require("prettier"));const PRETTIER_OPTIONS={bracketSpacing:!1,parser:"json-stringify",printWidth:150,tabWidth:4,singleQuote:!0},newMap=a=>new Map(a),joinPath=a=>(0,_path.join)(process.cwd(),a),checkPathExists=a=>{var b,c;return b=(c=a,joinPath(c)),(0,_fsExtra.pathExists)(b)},checkPathExistsSync=a=>{var b,c;return b=(c=a,joinPath(c)),(0,_fsExtra.pathExistsSync)(b)},dict=a=>{var b,c;return b=(c=a,Object.entries(c)),newMap(b)};exports.dict=dict;const parse=a=>{var b,c;return b=(c=a,JSON.stringify(c)),JSON.parse(b)};exports.parse=parse;const maybeApply=(a,b)=>(0,_is2.default)(Function)(a)?a(b):a;exports.maybeApply=maybeApply;const getBinDirectory=a=>{const[b]=a.split("Makefile");return`${b}node_modules/.bin/`};/**
 * Format input code using Prettier
 * @param {*} [code=''] Code to be formatted
 * @example <caption>Prettier options</caption>
 * {
 *     bracketSpacing: false,
 *     parser: 'json-stringify',
 *     printWidth: 150,
 *     tabWidth: 4,
 *     singleQuote: true
 * }
 * @return {string} Code formatted by Prettier
 */exports.getBinDirectory=getBinDirectory;const format=(a={})=>_prettier.default.format(JSON.stringify(a),PRETTIER_OPTIONS).replace(/"/g,"");/**
 * Check that at least one file or files exist
 * @param  {...string} args File or folder path(s)
 * @example
 * // some/folder/
 * //   ├─ foo.js
 * //   └── bar.js
 * const hasFoo = someDoExist('some/folder/foo.js');
 * const hasBaz = someDoExist('some/folder/baz.js');
 * const hasSomething = someDoExist('some/folder/bar.js', 'some/folder/baz.js');
 * console.log(hasFoo); // true
 * console.log(hasBaz); // false
 * console.log(hasSomething); // true
 * @return {boolean} Some files/path do exist (true) or all do not exist (false)
 */exports.format=format;const someDoExist=/*#__PURE__*/function(){var a=(0,_asyncToGenerator2.default)(function*(...a){const b=yield Promise.all(a.map(checkPathExists));return b.some(Boolean)});return function(){return a.apply(this,arguments)}}();/**
 * Check that at least one file or files exist (synchronous version of {@link someDoExist})
 * @param  {...string} args File or folder path(s)
 * @return {boolean} Some files/path do exist (true) or all do not exist (false)
 */exports.someDoExist=someDoExist;const someDoExistSync=(...a)=>a.map(checkPathExistsSync).some(Boolean);/**
 * Check that all files exist
 * @param  {...string} args File of folder paths
 * @return {boolean} All files/paths exist (true) or do not (false)
 */exports.someDoExistSync=someDoExistSync;const allDoExist=/*#__PURE__*/function(){var a=(0,_asyncToGenerator2.default)(function*(...a){const b=yield Promise.all(a.map(checkPathExists));return b.every(Boolean)});return function(){return a.apply(this,arguments)}}();/**
 * Check that all files exist (synchronous version of {@link allDoExist})
 * @param  {...string} args File of folder paths
 * @return {boolean} All files/paths exist (true) or do not (false)
 */exports.allDoExist=allDoExist;const allDoExistSync=(...a)=>a.map(checkPathExistsSync).every(Boolean);/**
 * Check that all files do not exist
 * @example
 * // some/folder/
 * //   ├─ foo.js
 * //   └── bar.js
 * const noPackageJson = allDoNotExist('some/folder/package.json');
 * console.log(noPackageJson); // true
 * @param  {...string} args File or folder path(s)
 * @return {boolean} All files/paths do not exist (true) or some do (false)
 */exports.allDoExistSync=allDoExistSync;const allDoNotExist=/*#__PURE__*/function(){var a=(0,_asyncToGenerator2.default)(function*(...a){const b=yield Promise.all(a.map(checkPathExists));return b.every(a=>!a)});return function(){return a.apply(this,arguments)}}();/**
 * Check that all files do not exist (synchronous version of {@link allDoNotExist})
 * @param  {...string} args File or folder path(s)
 * @return {boolean} All files/paths do not exist (true) or some do (false)
 */exports.allDoNotExist=allDoNotExist;const allDoNotExistSync=(...a)=>a.map(checkPathExistsSync).every(a=>!a);exports.allDoNotExistSync=allDoNotExistSync;