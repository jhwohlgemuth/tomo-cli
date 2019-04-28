"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allDoNotExistSync = exports.allDoNotExist = exports.allDoExistSync = exports.allDoExist = exports.someDoExistSync = exports.someDoExist = exports.format = exports.getBinDirectory = exports.getCommandDirectory = exports.parse = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = require("path");

var _fsExtra = require("fs-extra");

var _shelljs = require("shelljs");

var _lodash = require("lodash");

var _prettier = _interopRequireDefault(require("prettier"));

const PRETTIER_OPTIONS = {
  bracketSpacing: false,
  parser: 'json-stringify',
  printWidth: 80,
  tabWidth: 4,
  quotes: true
};

const parse = data => JSON.parse(JSON.stringify(data));

exports.parse = parse;

const getCommandDirectory = command => {
  const data = (0, _shelljs.which)(command);
  const commandExists = (0, _lodash.negate)(_lodash.isNull)(data);
  return commandExists ? data.toString().split(command)[0] : '';
};

exports.getCommandDirectory = getCommandDirectory;

const getBinDirectory = path => {
  const [packageDirectory] = path.split('Makefile');
  return `${packageDirectory}node_modules/.bin/`;
};
/**
 * Format input code using Prettier
 * @param {*} [code=''] Code to be formatted
 * @example <caption>Prettier options</caption>
 * {
 *     bracketSpacing: false,
 *     parser: 'json-stringify',
 *     printWidth: 80,
 *     tabWidth: 4,
 *     quotes: true
 * }
 * @return {string} Code formatted by Prettier
 */


exports.getBinDirectory = getBinDirectory;

const format = (code = {}) => _prettier.default.format(JSON.stringify(code), PRETTIER_OPTIONS).replace(/"/g, '');
/**
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
 */


exports.format = format;

const someDoExist =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (...args) {
    const checks = yield Promise.all(args.map(val => (0, _fsExtra.pathExists)((0, _path.join)(process.cwd(), val))));
    return checks.some(Boolean);
  });

  return function someDoExist() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Check that at least one file or files exist (synchronous version of {@link someDoExist})
 * @param  {...string} args File or folder path(s)
 * @return {boolean} Some files/path do exist (true) or all do not exist (false)
 */


exports.someDoExist = someDoExist;

const someDoExistSync = (...args) => args.map(val => (0, _fsExtra.pathExistsSync)((0, _path.join)(process.cwd(), val))).some(Boolean);
/**
 * Check that all files exist
 * @param  {...string} args File of folder paths
 * @return {boolean} All files/paths exist (true) or do not (false)
 */


exports.someDoExistSync = someDoExistSync;

const allDoExist =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (...args) {
    const checks = yield Promise.all(args.map(val => (0, _fsExtra.pathExists)((0, _path.join)(process.cwd(), val))));
    return checks.every(Boolean);
  });

  return function allDoExist() {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Check that all files exist (synchronous version of {@link allDoExist})
 * @param  {...string} args File of folder paths
 * @return {boolean} All files/paths exist (true) or do not (false)
 */


exports.allDoExist = allDoExist;

const allDoExistSync = (...args) => args.map(val => (0, _fsExtra.pathExistsSync)((0, _path.join)(process.cwd(), val))).every(Boolean);
/**
 * Check that all files do not exist
 * @example
 * // some/folder/
 * //   ├─ foo.js
 * //   └── bar.js
 * const noPackageJson = allDoNotExist('some/folder/package.json');
 * console.log(noPackageJson); // true
 * @param  {...string} args File or folder path(s)
 * @return {boolean} All files/paths do not exist (true) or some do (false)
 */


exports.allDoExistSync = allDoExistSync;

const allDoNotExist =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2.default)(function* (...args) {
    const checks = yield Promise.all(args.map(val => (0, _fsExtra.pathExists)((0, _path.join)(process.cwd(), val))));
    return checks.every(val => !val);
  });

  return function allDoNotExist() {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Check that all files do not exist (synchronous version of {@link allDoNotExist})
 * @param  {...string} args File or folder path(s)
 * @return {boolean} All files/paths do not exist (true) or some do (false)
 */


exports.allDoNotExist = allDoNotExist;

const allDoNotExistSync = (...args) => args.map(val => (0, _fsExtra.pathExistsSync)((0, _path.join)(process.cwd(), val))).every(val => !val);

exports.allDoNotExistSync = allDoNotExistSync;