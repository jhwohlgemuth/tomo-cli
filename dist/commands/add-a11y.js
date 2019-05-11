"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.addA11y = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _utils = require("../utils");

var _common = require("../utils/common");

/**
 * @type {task[]}
 * @see http://pa11y.org/
 */
const addA11y = [{
  text: 'Add a11y tasks to package.json',
  task: function () {
    var _ref = (0, _asyncToGenerator2.default)(function* ({
      sourceDirectory
    }) {
      const scripts = {
        'lint:a11y': `${sourceDirectory}/index.html`
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
}, {
  text: 'Install a11y dependencies',
  task: ({
    skipInstall
  }) => (0, _utils.install)(['pa11y'], {
    dev: true,
    skipInstall
  }),
  condition: ({
    isNotOffline
  }) => isNotOffline && (0, _common.someDoExist)('package.json')
}];
exports.addA11y = addA11y;
var _default = addA11y;
exports.default = _default;