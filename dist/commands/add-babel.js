"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.addBabel = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _utils = require("../utils");

var _common = require("../utils/common");

const BABEL_CORE = ['@babel/cli', '@babel/core', '@babel/runtime'];
const BABEL_PRESETS = ['@babel/preset-env'];
const BABEL_PLUGINS = ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-export-default-from', '@babel/plugin-proposal-optional-chaining'];
const BABEL_REACT_PRESET = ['@babel/preset-react'];
const BABEL_DEPENDENCIES = [...BABEL_CORE, ...BABEL_PRESETS, ...BABEL_PLUGINS];
/**
 * @type {task[]}
 * @see https://babeljs.io/
 */

const addBabel = [{
  text: 'Create Babel config file',
  task: function () {
    var _ref = (0, _asyncToGenerator2.default)(function* () {
      yield new _utils.BabelConfigModuleEditor().create().commit();
    });

    return function task() {
      return _ref.apply(this, arguments);
    };
  }(),
  condition: () => (0, _common.allDoNotExist)('babel.config.js', '.babelrc', '.babelrc.js')
}, {
  text: 'Install Babel core, CLI, presets, and plugins',
  task: ({
    skipInstall
  }) => (0, _utils.install)(BABEL_DEPENDENCIES, {
    dev: true,
    skipInstall
  }),
  condition: ({
    isNotOffline
  }) => isNotOffline && !new _utils.PackageJsonEditor().hasAll(...BABEL_DEPENDENCIES) && (0, _common.someDoExist)('package.json')
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
  }) => useReact && (0, _common.someDoExist)('package.json'),
  optional: ({
    useReact
  }) => useReact
}, {
  text: 'Add React support to Babel configuration file',
  task: function () {
    var _ref2 = (0, _asyncToGenerator2.default)(function* () {
      const presets = [...BABEL_PRESETS, ...BABEL_REACT_PRESET];
      yield new _utils.BabelConfigModuleEditor().extend({
        presets
      }).commit();
    });

    return function task() {
      return _ref2.apply(this, arguments);
    };
  }(),
  condition: ({
    useReact
  }) => useReact && (0, _common.someDoExist)('babel.config.js'),
  optional: ({
    useReact
  }) => useReact
}];
exports.addBabel = addBabel;
var _default = addBabel;
exports.default = _default;