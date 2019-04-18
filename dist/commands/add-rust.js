"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _figures = require("figures");

var _utils = require("../utils");

/* eslint-disable max-len */
const pkg = new _utils.PackageJsonEditor();
var _default = [{
  text: `Add Rust ${_figures.arrowRight} WASM build tasks to package.json`,
  task: function () {
    var _ref = (0, _asyncToGenerator2.default)(function* ({
      assetsDirectory
    }) {
      yield pkg.extend({
        script: {
          'build:wasm': `rustc +nightly --target wasm32-unknown-unknown -O --crate-type=cdylib ${assetsDirectory}/rust/main.rs -o ./${assetsDirectory}/rust/main.wasm`,
          'postbuild:wasm': `wasm-gc ${assetsDirectory}/rust/main.wasm ${assetsDirectory}/rust/main.min.wasm`
        }
      }).commit();
    });

    return function task(_x) {
      return _ref.apply(this, arguments);
    };
  }(),
  condition: () => (0, _utils.someDoExist)('package.json')
}];
exports.default = _default;