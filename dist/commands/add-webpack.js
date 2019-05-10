"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.addWebpack = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _utils = require("../utils");

var _common = require("../utils/common");

const WEBPACK_DEPENDENCIES = ['webpack', 'webpack-cli', 'webpack-dashboard', 'webpack-jarvis', 'webpack-dev-server', 'babel-loader'];
/**
 * @type {task[]}
 * @see https://webpack.js.org/
 */

const addWebpack = [{
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
  condition: () => (0, _common.allDoNotExist)('webpack.config.js')
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
  condition: () => (0, _common.someDoExist)('package.json')
}, {
  text: 'Install Webpack dependencies',
  task: ({
    skipInstall
  }) => (0, _utils.install)(WEBPACK_DEPENDENCIES, {
    dev: true,
    skipInstall
  }),
  condition: () => (0, _common.someDoExist)('package.json')
}];
exports.addWebpack = addWebpack;
var _default = addWebpack;
exports.default = _default;