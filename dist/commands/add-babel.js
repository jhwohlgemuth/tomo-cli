"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../utils");

const cfg = new _utils.BabelConfigModuleEditor();
const BABEL_DEPENDENCIES = ['@babel/cli', '@babel/core', '@babel/runtime'];
const BABEL_PRESETS = ['@babel/preset-env'];
const BABEL_PLUGINS = ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-export-default-from', '@babel/plugin-proposal-optional-chaining'];
const BABEL_REACT_PRESET = ['@babel/preset-react'];
var _default = [{
  text: 'Create Babel config file',
  task: () => cfg.create(),
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
  task: () => cfg.extend({
    presets: [...BABEL_PRESETS, ...BABEL_REACT_PRESET]
  }),
  condition: ({
    useReact
  }) => useReact && (0, _utils.someDoExist)('babel.config.js'),
  optional: ({
    useReact
  }) => useReact
}];
exports.default = _default;