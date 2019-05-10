"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.rustTasks = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _figures = require("figures");

var _utils = require("../utils");

var _common = require("../utils/common");

/* eslint-disable max-len */

/**
 * @type {task[]}
 * @see https://webpack.js.org/
 */
const rustTasks = [{
  text: `Add Rust ${_figures.arrowRight} WASM build tasks to package.json`,
  task: function () {
    var _ref = (0, _asyncToGenerator2.default)(function* ({
      assetsDirectory
    }) {
      const scripts = {
        'build:wasm': `rustc +nightly --target wasm32-unknown-unknown -O --crate-type=cdylib ${assetsDirectory}/rust/main.rs -o ./${assetsDirectory}/rust/main.wasm`,
        'postbuild:wasm': `wasm-gc ${assetsDirectory}/rust/main.wasm ${assetsDirectory}/rust/main.min.wasm`
      };
      const pkg = new _utils.PackageJsonEditor();
      yield pkg.extend({
        scripts
      }).commit();
    });

    return function task(_x) {
      return _ref.apply(this, arguments);
    };
  }(),
  condition: () => (0, _common.someDoExist)('package.json')
}];
exports.rustTasks = rustTasks;
var _default = rustTasks;
exports.default = _default;