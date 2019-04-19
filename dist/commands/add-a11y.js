"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.tasks = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _utils = require("../utils");

const pkg = new _utils.PackageJsonEditor();
/** @ignore */

const tasks = [{
  text: 'Add a11y tasks to package.json',
  task: function () {
    var _ref = (0, _asyncToGenerator2.default)(function* ({
      sourceDirectory
    }) {
      const script = {
        'lint:a11y': `${sourceDirectory}/index.html`
      };
      yield pkg.extend({
        script
      }).commit();
    });

    return function task(_x) {
      return _ref.apply(this, arguments);
    };
  }(),
  condition: () => (0, _utils.someDoExist)('package.json')
}, {
  text: 'Install a11y dependencies',
  task: ({
    skipInstall
  }) => (0, _utils.install)(['pa11y'], {
    dev: true,
    skipInstall
  }),
  condition: () => (0, _utils.someDoExist)('package.json')
}];
exports.tasks = tasks;
var _default = tasks;
exports.default = _default;