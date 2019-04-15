"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../utils");

const pkg = new _utils.PackageJsonEditor();
const cfg = new _utils.PostcssConfigEditor();
const POSTCSS_DEPENDENCIES = ['cssnano', 'postcss-cli', 'postcss-reporter', 'postcss-safe-parser', 'postcss-import', 'postcss-cssnext', 'stylelint', 'uncss'];
var _default = [{
  text: 'Create PostCSS config file',
  task: () => cfg.create(),
  condition: () => (0, _utils.allDoNotExist)('postcss.config.js')
}, {
  text: 'Install PostCSS dependencies',
  task: ({
    skipInstall
  }) => (0, _utils.install)([POSTCSS_DEPENDENCIES], {
    dev: true,
    skipInstall
  }),
  condition: () => (0, _utils.someDoExist)('package.json')
}, {
  text: 'Add PostCSS tasks to package.json',
  task: () => pkg.extend({}),
  condition: () => (0, _utils.someDoExist)('package.json')
}];
exports.default = _default;