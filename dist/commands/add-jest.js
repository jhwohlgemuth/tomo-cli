"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../utils");

const pkg = new _utils.PackageJsonEditor();
const JEST_DEPENDENCIES = ['jest', 'babel-jest'];
var _default = [{
  text: 'Add test tasks to package.json',
  task: () => pkg.extend({
    script: {
      test: 'jest .*.test.js --coverage',
      'test:watch': 'npm test -- --watchAll'
    }
  }),
  condition: () => (0, _utils.someDoExist)('package.json')
}, {
  text: 'Install Jest dependencies',
  task: ({
    skipInstall
  }) => (0, _utils.install)(JEST_DEPENDENCIES, {
    dev: true,
    skipInstall
  }),
  condition: () => (0, _utils.someDoExist)('package.json')
}];
exports.default = _default;