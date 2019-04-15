"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSourceDirectory = exports.createPackageJson = void 0;

var _fsExtra = require("fs-extra");

var _utils = require("../utils");

const createPackageJson = [{
  text: 'Create package.json',
  task: () => {
    const pkg = new _utils.PackageJsonEditor();
    pkg.create();
  },
  condition: () => (0, _utils.allDoNotExist)('package.json')
}];
exports.createPackageJson = createPackageJson;
const createSourceDirectory = [{
  text: 'Create source directory',
  task: ({
    sourceDirectory
  }) => (0, _fsExtra.mkdirp)(sourceDirectory),
  condition: ({
    sourceDirectory
  }) => (0, _utils.allDoNotExist)(sourceDirectory)
}];
exports.createSourceDirectory = createSourceDirectory;