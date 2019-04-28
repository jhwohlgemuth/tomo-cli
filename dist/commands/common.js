"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSourceDirectory = exports.createPackageJson = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fsExtra = require("fs-extra");

var _utils = require("../utils");

var _common = require("../utils/common");

/** @ignore */
const createPackageJson = [{
  text: 'Create package.json',
  task: function () {
    var _ref = (0, _asyncToGenerator2.default)(function* () {
      const pkg = new _utils.PackageJsonEditor();
      yield pkg.create().commit();
    });

    return function task() {
      return _ref.apply(this, arguments);
    };
  }(),
  condition: () => (0, _common.allDoNotExist)('package.json')
}];
/** @ignore */

exports.createPackageJson = createPackageJson;
const createSourceDirectory = [{
  text: 'Create source directory',
  task: ({
    sourceDirectory
  }) => (0, _fsExtra.mkdirp)(sourceDirectory),
  condition: ({
    sourceDirectory
  }) => (0, _common.allDoNotExist)(sourceDirectory)
}];
exports.createSourceDirectory = createSourceDirectory;