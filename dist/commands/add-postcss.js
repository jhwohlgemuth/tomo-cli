"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _utils = require("../utils");

const pkg = new _utils.PackageJsonEditor();
const cfg = new _utils.PostcssConfigEditor();
const POSTCSS_DEPENDENCIES = ['cssnano', 'postcss-cli', 'postcss-reporter', 'postcss-safe-parser', 'postcss-import', 'postcss-cssnext', 'stylelint', 'uncss'];
var _default = [{
  text: 'Create PostCSS config file',
  task: function () {
    var _ref = (0, _asyncToGenerator2.default)(function* () {
      yield cfg.create().commit();
    });

    return function task() {
      return _ref.apply(this, arguments);
    };
  }(),
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