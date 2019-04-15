"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _delay = _interopRequireDefault(require("delay"));

var _utils = require("../utils");

var _common = require("./common");

var _addBabel = _interopRequireDefault(require("./add-babel"));

var _addJsdoc = _interopRequireDefault(require("./add-jsdoc"));

var _addEslint = _interopRequireDefault(require("./add-eslint"));

var _addJest = _interopRequireDefault(require("./add-jest"));

var _addPostcss = _interopRequireDefault(require("./add-postcss"));

/* eslint-disable no-magic-numbers */

/**
 * @file tomo commands
 * @author Jason Wohlgemuth
 * @module commands
 * @requires module:utils
 */
const ALWAYS =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* () {
    return true;
  });

  return function ALWAYS() {
    return _ref.apply(this, arguments);
  };
}();

const testAsyncFunction = () =>
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* ({
    skipInstall
  }) {
    return yield (0, _delay.default)(skipInstall ? 0 : 1000 * Math.random());
  });

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();

const newWebapp = [{
  text: 'Install development dependencies',
  task: testAsyncFunction(),
  condition: ALWAYS
}, {
  text: 'Install production dependencies',
  task: testAsyncFunction(),
  condition: ALWAYS
}, {
  text: 'Scaffold webapp folder structure',
  task: testAsyncFunction(),
  condition: ALWAYS
}];
const addA11y = [{
  text: 'Add a11y tasks to package.json',
  task: testAsyncFunction(),
  condition: () => (0, _utils.someDoExist)('package.json')
}, {
  text: 'Install a11y dependencies',
  task: testAsyncFunction(),
  condition: ALWAYS
}];
const addWebpack = [{
  text: 'Create Webpack config file',
  task: testAsyncFunction(),
  condition: () => (0, _utils.allDoNotExist)('webpack.config.js')
}, {
  text: 'Install Webpack dependencies',
  task: testAsyncFunction(),
  condition: ALWAYS
}];
const create = {
  app: [..._common.createPackageJson, ..._common.createSourceDirectory, ..._addBabel.default, ..._addEslint.default, ..._addJest.default],
  webapp: [..._common.createPackageJson, ..._common.createSourceDirectory, ..._addBabel.default, ..._addEslint.default, ..._addJest.default, ...newWebapp],
  server: []
};
const add = {
  a11y: addA11y,
  babel: _addBabel.default,
  docs: _addJsdoc.default,
  eslint: [..._addBabel.default, ..._addEslint.default],
  jest: [..._addBabel.default, ..._addJest.default],
  postcss: _addPostcss.default,
  webpack: addWebpack
};
module.exports = {
  add,
  create,
  new: create // alias for create

};