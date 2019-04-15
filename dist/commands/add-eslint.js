"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../utils");

const pkg = new _utils.PackageJsonEditor();
const cfg = new _utils.EslintConfigModuleEditor();
const ESLINT_DEPENDENCIES = ['eslint', 'babel-eslint', 'eslint-config-omaha-prime-grade', 'watch'];
const ESLINT_REACT_PLUGINS = ['eslint-plugin-react'];
var _default = [{
  text: 'Create ESLint config file',
  task: () => cfg.create(),
  condition: () => (0, _utils.allDoNotExist)('.eslintrc.js', '.eslintrc', '.eslintrc.json', '.eslintrc.yml')
}, {
  text: 'Add lint tasks to package.json',
  task: ({
    sourceDirectory
  }) => pkg.extend({
    script: {
      lint: `eslint -c ./.eslintrc.js ${sourceDirectory}/**/*.js --fix`,
      'lint:watch': `watch 'npm run lint' ${sourceDirectory}`
    }
  }),
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
  task: ({
    reactVersion
  }) => cfg.extend({
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
  }),
  condition: ({
    useReact
  }) => useReact && (0, _utils.someDoExist)('.eslintrc.js'),
  optional: ({
    useReact
  }) => useReact
}];
exports.default = _default;