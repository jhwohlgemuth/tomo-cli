"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.tasks = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _common = require("../utils/common");

var _MakefileEditor = _interopRequireDefault(require("../utils/MakefileEditor"));

/** @ignore */
const tasks = [{
  text: 'Create Makefile',
  task: function () {
    var _ref = (0, _asyncToGenerator2.default)(function* () {
      yield new _MakefileEditor.default().create().write('# Makefile built with tomo').commit();
    });

    return function task() {
      return _ref.apply(this, arguments);
    };
  }(),
  condition: () => (0, _common.allDoNotExist)('Makefile')
}, {
  text: 'Import tasks from package.json scripts',
  task: function () {
    var _ref2 = (0, _asyncToGenerator2.default)(function* () {
      yield new _MakefileEditor.default().delete().create().importScripts().appendScripts().appendHelpTask().commit();
    });

    return function task() {
      return _ref2.apply(this, arguments);
    };
  }(),
  condition: () => (0, _common.allDoExist)('Makefile', 'package.json'),
  optional: () => (0, _common.allDoExistSync)('Makefile', 'package.json')
}];
exports.tasks = tasks;
var _default = tasks;
exports.default = _default;