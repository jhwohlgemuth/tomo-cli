"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.tasks = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _utils = require("../utils");

const pkg = new _utils.PackageJsonEditor();
/**
 * @ignore
 */

const tasks = [{
  text: 'Add documentation tasks to package.json',
  task: function () {
    var _ref = (0, _asyncToGenerator2.default)(function* ({
      sourceDirectory
    }) {
      yield pkg.extend({
        script: {
          'lint:docs': `eslint . --no-eslintrc --rule valid-jsdoc:error --parser babel-eslint`,
          'build:docs': `jsdoc ${sourceDirectory} -r --destination ./docs`,
          'open:docs': 'opn ./docs/index.html',
          predocs: 'npm run lint:docs',
          docs: 'npm run build:docs',
          postdocs: 'npm run open:docs'
        }
      }).commit();
    });

    return function task(_x) {
      return _ref.apply(this, arguments);
    };
  }(),
  condition: () => (0, _utils.someDoExist)('package.json')
}, {
  text: 'Install Documentation.js dependencies',
  task: ({
    skipInstall
  }) => (0, _utils.install)(['jsdoc', 'opn-cli'], {
    dev: true,
    skipInstall
  }),
  condition: () => (0, _utils.someDoExist)('package.json')
}];
exports.tasks = tasks;
var _default = tasks;
exports.default = _default;