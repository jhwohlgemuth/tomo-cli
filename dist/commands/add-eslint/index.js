"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = require("path");

var _utils = require("../../utils");

const pkg = new _utils.PackageJsonEditor();
const cfg = new _utils.EslintConfigModuleEditor();
const ESLINT_DEPENDENCIES = ['eslint', 'babel-eslint', 'eslint-config-omaha-prime-grade', 'watch'];
const ESLINT_REACT_PLUGINS = ['eslint-plugin-react'];
const sourceDirectory = (0, _path.join)(__dirname, 'templates');
const scaffolder = new _utils.Scaffolder({
  sourceDirectory
});
var _default = [{
  text: 'Create ESLint configuration and ignore files',
  task: function () {
    var _ref = (0, _asyncToGenerator2.default)(function* ({
      sourceDirectory
    }) {
      yield cfg.create();
      yield scaffolder.target(sourceDirectory).copy('index.html');
    });

    return function task(_x) {
      return _ref.apply(this, arguments);
    };
  }(),
  condition: () => (0, _utils.allDoNotExist)('.eslintrc.js', '.eslintrc', '.eslintrc.json', '.eslintrc.yml')
}, {
  text: 'Add lint tasks to package.json',
  task: function () {
    var _ref2 = (0, _asyncToGenerator2.default)(function* ({
      sourceDirectory
    }) {
      yield pkg.extend({
        script: {
          lint: `eslint . -c ./.eslintrc.js --fix`,
          'lint:watch': `watch 'npm run lint' ${sourceDirectory}`,
          'lint:tests': 'eslint __tests__/**/*.js -c ./.eslintrc.js --fix --no-ignore'
        }
      });
    });

    return function task(_x2) {
      return _ref2.apply(this, arguments);
    };
  }(),
  condition: () => (0, _utils.someDoExist)('package.json')
}, {
  text: 'Install ESLint dependencies',
  task: ({
    skipInstall
  }) => (0, _utils.install)(ESLINT_DEPENDENCIES, {
    dev: true,
    skipInstall
  }),
  condition: () => (0, _utils.someDoExist)('package.json')
}, {
  text: 'Install ESLint React plugins',
  task: ({
    skipInstall
  }) => (0, _utils.install)(ESLINT_REACT_PLUGINS, {
    dev: true,
    skipInstall
  }),
  condition: ({
    useReact
  }) => useReact && (0, _utils.someDoExist)('package.json'),
  optional: ({
    useReact
  }) => useReact
}, {
  text: 'Add React support to ESLint configuration file',
  task: function () {
    var _ref3 = (0, _asyncToGenerator2.default)(function* ({
      reactVersion
    }) {
      yield cfg.extend({
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          }
        },
        settings: {
          react: {
            version: `'${reactVersion}'`
          }
        },
        extends: ['omaha-prime-grade', 'plugin:react/recommended']
      });
    });

    return function task(_x3) {
      return _ref3.apply(this, arguments);
    };
  }(),
  condition: ({
    useReact
  }) => useReact && (0, _utils.someDoExist)('.eslintrc.js'),
  optional: ({
    useReact
  }) => useReact
}];
exports.default = _default;