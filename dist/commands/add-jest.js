"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.addJest = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _utils = require("../utils");

var _common = require("../utils/common");

const JEST_DEPENDENCIES = ['jest', 'babel-jest'];
/**
 * @type {task[]}
 * @see https://jestjs.io/
 */

const addJest = [{
  text: 'Add test tasks to package.json',
  task: function () {
    var _ref = (0, _asyncToGenerator2.default)(function* () {
      const scripts = {
        test: 'jest .*.test.js --coverage',
        'test:watch': 'npm test -- --watchAll'
      };
      const pkg = new _utils.PackageJsonEditor();
      yield pkg.extend({
        scripts
      }).commit();
    });

    return function task() {
      return _ref.apply(this, arguments);
    };
  }(),
  condition: () => (0, _common.someDoExist)('package.json')
}, {
  text: 'Install Jest dependencies',
  task: ({
    skipInstall
  }) => (0, _utils.install)(JEST_DEPENDENCIES, {
    dev: true,
    skipInstall
  }),
  condition: () => (0, _common.someDoExist)('package.json')
}];
exports.addJest = addJest;
var _default = addJest;
exports.default = _default;