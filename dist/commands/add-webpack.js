"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.tasks = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _utils = require("../utils");

var _addBabel = _interopRequireDefault(require("./add-babel"));

const WEBPACK_DEPENDENCIES = ['webpack', 'webpack-cli', 'webpack-dashboard', 'webpack-jarvis', 'webpack-dev-server', 'babel-loader'];
/** @ignore */

const tasks = [..._addBabel.default, {
  text: 'Create Webpack configuration file',
  task: function () {
    var _ref = (0, _asyncToGenerator2.default)(function* ({
      sourceDirectory
    }) {
      const entry = {
        app: `'${sourceDirectory}/main.js'`
      };
      yield new _utils.WebpackConfigEditor().create().prepend(`const DashboardPlugin = require('webpack-dashboard/plugin');`).prepend(`const {resolve} = require('path');`).extend({
        entry
      }).commit();
    });

    return function task(_x) {
      return _ref.apply(this, arguments);
    };
  }(),
  condition: () => (0, _utils.allDoNotExist)('webpack.config.js')
}, {
  text: 'Add build tasks to package.json',
  task: function () {
    var _ref2 = (0, _asyncToGenerator2.default)(function* () {
      const scripts = {
        build: 'webpack',
        'build:watch': 'webpack-dashboard -- webpack-dev-server --config ./webpack.config.js'
      };
      yield new _utils.PackageJsonEditor().extend({
        scripts
      }).commit();
    });

    return function task() {
      return _ref2.apply(this, arguments);
    };
  }(),
  condition: () => (0, _utils.someDoExist)('package.json')
}, {
  text: 'Install Webpack dependencies',
  task: ({
    skipInstall
  }) => (0, _utils.install)(WEBPACK_DEPENDENCIES, {
    dev: true,
    skipInstall
  }),
  condition: () => (0, _utils.someDoExist)('package.json')
}];
exports.tasks = tasks;
var _default = tasks;
exports.default = _default;