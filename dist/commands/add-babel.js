"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.tasks = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _utils = require("../utils");

const BABEL_DEPENDENCIES = ['@babel/cli', '@babel/core', '@babel/runtime'];
const BABEL_PRESETS = ['@babel/preset-env'];
const BABEL_PLUGINS = ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-export-default-from', '@babel/plugin-proposal-optional-chaining'];
const BABEL_REACT_PRESET = ['@babel/preset-react'];
const cfg = new _utils.BabelConfigModuleEditor();
/** @ignore */

const tasks = [{
  text: 'Create Babel config file',
  task: function () {
    var _ref = (0, _asyncToGenerator2.default)(function* () {
      yield cfg.create().commit();
    });

    return function task() {
      return _ref.apply(this, arguments);
    };
  }(),
  condition: () => (0, _utils.allDoNotExist)('babel.config.js', '.babelrc', '.babelrc.js')
}, {
  text: 'Install Babel dependencies',
  task: ({
    skipInstall
  }) => (0, _utils.install)(BABEL_DEPENDENCIES, {
    dev: true,
    skipInstall
  }),
  condition: () => (0, _utils.someDoExist)('package.json')
}, {
  text: 'Install Babel presets',
  task: ({
    skipInstall
  }) => (0, _utils.install)(BABEL_PRESETS, {
    dev: true,
    skipInstall
  }),
  condition: () => (0, _utils.someDoExist)('package.json')
}, {
  text: 'Install Babel plugins',
  task: ({
    skipInstall
  }) => (0, _utils.install)(BABEL_PLUGINS, {
    dev: true,
    skipInstall
  }),
  condition: () => (0, _utils.someDoExist)('package.json')
}, {
  text: 'Install Babel React preset',
  task: ({
    skipInstall
  }) => (0, _utils.install)(BABEL_REACT_PRESET, {
    dev: true,
    skipInstall
  }),
  condition: ({
    useReact
  }) => useReact && (0, _utils.someDoExist)('package.json'),
  optional: ({
    useReact
  }) => useReact
}, {
  text: 'Add React support to Babel configuration file',
  task: function () {
    var _ref2 = (0, _asyncToGenerator2.default)(function* () {
      const presets = [...BABEL_PRESETS, ...BABEL_REACT_PRESET];
      yield cfg.extend({
        presets
      }).commit();
    });

    return function task() {
      return _ref2.apply(this, arguments);
    };
  }(),
  condition: ({
    useReact
  }) => useReact && (0, _utils.someDoExist)('babel.config.js'),
  optional: ({
    useReact
  }) => useReact
}];
exports.tasks = tasks;
var _default = tasks;
exports.default = _default;