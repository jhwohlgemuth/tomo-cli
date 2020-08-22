"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.array.iterator"),require("core-js/modules/es.object.entries"),require("core-js/modules/es.promise"),require("core-js/modules/es.string.replace"),require("core-js/modules/es.string.split"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.allDoNotExistSync=exports.allDoNotExist=exports.allDoExistSync=exports.allDoExist=exports.someDoExistSync=exports.someDoExist=exports.format=exports.getBinDirectory=exports.maybeApply=exports.parse=exports.isEmptyString=exports.dict=void 0;var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_is2=_interopRequireDefault(require("ramda/src/is")),_path=require("path"),_fsExtra=require("fs-extra"),_prettier=_interopRequireDefault(require("prettier"));const PRETTIER_OPTIONS={bracketSpacing:!1,parser:"json-stringify",printWidth:150,tabWidth:4,singleQuote:!0},newMap=val=>new Map(val),joinPath=name=>(0,_path.join)(process.cwd(),name),checkPathExists=name=>{var _ref,_name;return _ref=(_name=name,joinPath(_name)),(0,_fsExtra.pathExists)(_ref)},checkPathExistsSync=name=>{var _ref2,_name2;return _ref2=(_name2=name,joinPath(_name2)),(0,_fsExtra.pathExistsSync)(_ref2)},dict=val=>{var _ref3,_val;return _ref3=(_val=val,Object.entries(_val)),newMap(_ref3)};exports.dict=dict;const isEmptyString=data=>"string"==typeof data&&0===data.length;exports.isEmptyString=isEmptyString;const parse=data=>{var _ref4,_data;return _ref4=(_data=data,JSON.stringify(_data)),JSON.parse(_ref4)};exports.parse=parse;const maybeApply=(val,options)=>(0,_is2.default)(Function)(val)?val(options):val;exports.maybeApply=maybeApply;const getBinDirectory=path=>{const[packageDirectory]=path.split("Makefile");return`${packageDirectory}node_modules/.bin/`};/**
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
 */exports.getBinDirectory=getBinDirectory;const format=(code={})=>_prettier.default.format(JSON.stringify(code),PRETTIER_OPTIONS).replace(/"/g,"");/**
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
 */exports.format=format;const someDoExist=/*#__PURE__*/function(){var _ref5=(0,_asyncToGenerator2.default)(function*(...args){const checks=yield Promise.all(args.map(checkPathExists));return checks.some(Boolean)});return function(){return _ref5.apply(this,arguments)}}();/**
 * Check that at least one file or files exist (synchronous version of {@link someDoExist})
 * @param  {...string} args File or folder path(s)
 * @return {boolean} Some files/path do exist (true) or all do not exist (false)
 */exports.someDoExist=someDoExist;const someDoExistSync=(...args)=>args.map(checkPathExistsSync).some(Boolean);/**
 * Check that all files exist
 * @param  {...string} args File of folder paths
 * @return {boolean} All files/paths exist (true) or do not (false)
 */exports.someDoExistSync=someDoExistSync;const allDoExist=/*#__PURE__*/function(){var _ref6=(0,_asyncToGenerator2.default)(function*(...args){const checks=yield Promise.all(args.map(checkPathExists));return checks.every(Boolean)});return function(){return _ref6.apply(this,arguments)}}();/**
 * Check that all files exist (synchronous version of {@link allDoExist})
 * @param  {...string} args File of folder paths
 * @return {boolean} All files/paths exist (true) or do not (false)
 */exports.allDoExist=allDoExist;const allDoExistSync=(...args)=>args.map(checkPathExistsSync).every(Boolean);/**
 * Check that all files do not exist
 * @example
 * // some/folder/
 * //   ├─ foo.js
 * //   └── bar.js
 * const noPackageJson = allDoNotExist('some/folder/package.json');
 * console.log(noPackageJson); // true
 * @param  {...string} args File or folder path(s)
 * @return {boolean} All files/paths do not exist (true) or some do (false)
 */exports.allDoExistSync=allDoExistSync;const allDoNotExist=/*#__PURE__*/function(){var _ref7=(0,_asyncToGenerator2.default)(function*(...args){const checks=yield Promise.all(args.map(checkPathExists));return checks.every(val=>!val)});return function(){return _ref7.apply(this,arguments)}}();/**
 * Check that all files do not exist (synchronous version of {@link allDoNotExist})
 * @param  {...string} args File or folder path(s)
 * @return {boolean} All files/paths do not exist (true) or some do (false)
 */exports.allDoNotExist=allDoNotExist;const allDoNotExistSync=(...args)=>args.map(checkPathExistsSync).every(val=>!val);exports.allDoNotExistSync=allDoNotExistSync;