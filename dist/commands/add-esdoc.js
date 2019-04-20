"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.tasks = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _utils = require("../utils");

const ESDOC_CONF = {
  source: './src',
  destination: './docs',
  plugins: [{
    name: 'esdoc-standard-plugin'
  }, {
    name: 'esdoc-ecmascript-proposal-plugin',
    option: {
      all: true
    }
  }]
};
const ESDOC_DEPENDENCIES = ['esdoc', 'esdoc-ecmascript-proposal-plugin', 'esdoc-standard-plugin'];
const ESDOC_REACT_PLUGINS = ['esdoc-jsx-plugin'];
const EsdocJsonEditor = (0, _utils.createJsonEditor)('esdoc.conf.json', ESDOC_CONF);
/** @ignore */

const tasks = [{
  text: 'Create esdoc configuration file',
  task: function () {
    var _ref = (0, _asyncToGenerator2.default)(function* () {
      const cfg = new EsdocJsonEditor();
      yield cfg.create().commit();
    });

    return function task() {
      return _ref.apply(this, arguments);
    };
  }(),
  condition: () => (0, _utils.allDoNotExist)('esdoc.conf.json', '.esdoc.json')
}, {
  text: 'Add documentation tasks to package.json',
  task: function () {
    var _ref2 = (0, _asyncToGenerator2.default)(function* ({
      sourceDirectory
    }) {
      const scripts = {
        'lint:docs': `eslint . --no-eslintrc --rule valid-jsdoc:error --parser babel-eslint`,
        'build:docs': `jsdoc ${sourceDirectory} -r --destination ./docs`,
        'open:docs': 'opn ./docs/index.html',
        predocs: 'npm run lint:docs',
        docs: 'npm run build:docs',
        postdocs: 'npm run open:docs'
      };
      const pkg = new _utils.PackageJsonEditor();
      yield pkg.extend({
        scripts
      }).commit();
    });

    return function task(_x) {
      return _ref2.apply(this, arguments);
    };
  }(),
  condition: () => (0, _utils.someDoExist)('package.json')
}, {
  text: 'Install esdoc dependencies',
  task: ({
    skipInstall
  }) => (0, _utils.install)([...ESDOC_DEPENDENCIES, 'opn-cli'], {
    dev: true,
    skipInstall
  }),
  condition: () => (0, _utils.someDoExist)('package.json')
}, {
  text: 'Install esdoc React plugins',
  task: ({
    skipInstall
  }) => (0, _utils.install)(ESDOC_REACT_PLUGINS, {
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
  text: 'Add esdoc React plugin to configuration file',
  task: function () {
    var _ref3 = (0, _asyncToGenerator2.default)(function* () {
      const {
        plugins
      } = ESDOC_CONF;
      const cfg = new EsdocJsonEditor();
      yield cfg.extend({
        plugins: [...plugins, {
          name: 'esdoc-jsx-plugin',
          options: {
            enable: true
          }
        }]
      }).commit();
    });

    return function task() {
      return _ref3.apply(this, arguments);
    };
  }(),
  condition: ({
    useReact
  }) => useReact && (0, _utils.someDoExist)('esdoc.conf.json'),
  optional: ({
    useReact
  }) => useReact
}];
exports.tasks = tasks;
var _default = tasks;
exports.default = _default;