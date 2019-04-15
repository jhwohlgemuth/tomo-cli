"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _figures = require("figures");

var _utils = require("../utils");

/* eslint-disable max-len */
const pkg = new _utils.PackageJsonEditor();
var _default = [{
  text: `Add Rust ${_figures.arrowRight} WASM build tasks to package.json`,
  task: ({
    assetsDirectory
  }) => pkg.extend({
    script: {
      'build:wasm': `rustc +nightly --target wasm32-unknown-unknown -O --crate-type=cdylib ${assetsDirectory}/rust/main.rs -o ./${assetsDirectory}/rust/main.wasm`,
      'postbuild:wasm': `wasm-gc ${assetsDirectory}/rust/main.wasm ${assetsDirectory}/rust/main.min.wasm`
    }
  }),
  condition: () => (0, _utils.someDoExist)('package.json')
}];
exports.default = _default;