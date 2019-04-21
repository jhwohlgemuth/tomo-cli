"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebpackConfigEditor = exports.PostcssConfigEditor = exports.PackageJsonEditor = exports.EslintConfigModuleEditor = exports.BabelConfigModuleEditor = exports.Scaffolder = exports.createModuleEditor = exports.createJsonEditor = exports.BasicEditor = exports.verifyRustInstallation = exports.install = exports.getVersions = exports.getIntendedInput = exports.format = exports.allDoNotExist = exports.someDoExist = exports.testAsyncFunction = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _delay = _interopRequireDefault(require("delay"));

var _path = require("path");

var _execa = _interopRequireDefault(require("execa"));

var _semver = _interopRequireDefault(require("semver"));

var _pQueue = _interopRequireDefault(require("p-queue"));

var _prettier = _interopRequireDefault(require("prettier"));

var _lodash = require("lodash");

var _fsExtra = require("fs-extra");

var _memFs = _interopRequireDefault(require("mem-fs"));

var _memFsEditor = _interopRequireDefault(require("mem-fs-editor"));

var _stringSimilarity = require("string-similarity");

const {
  assign
} = Object;
const INDENT_SPACES = 4;
const PRETTIER_OPTIONS = {
  bracketSpacing: false,
  parser: 'json-stringify',
  printWidth: 80,
  tabWidth: 4,
  quotes: true
}; // eslint-disable-next-line no-magic-numbers

const testAsyncFunction = () =>
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* ({
    skipInstall
  }) {
    return yield (0, _delay.default)(skipInstall ? 0 : 1000 * Math.random());
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Check that at least one file or files exist
 * @param  {...string} args File or folder path(s)
 * @example
 * // some/folder/
 * //   ├─ foo.js
 * //   └── bar.js
 * const hasFoo = someDoExist('some/folder/foo.js');
 * const hasBaz = someDoExist('some/folder/baz.js');
 * const hasSomething = someDoExist('some/folder/bar.js', 'some/folder/baz.js');
 * console.log(hasFoo); // true
 * console.log(hasBaz); // false
 * console.log(hasSomething); // true
 * @return {boolean} Some files/path do exist (true) or all do not exist (false)
 */


exports.testAsyncFunction = testAsyncFunction;

const someDoExist =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (...args) {
    const checks = yield Promise.all(args.map(val => (0, _fsExtra.pathExists)((0, _path.join)(process.cwd(), val))));
    return checks.some(Boolean);
  });

  return function someDoExist() {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Check that all files do not exist
 * @example
 * // some/folder/
 * //   ├─ foo.js
 * //   └── bar.js
 * const noPackageJson = allDoNotExist('some/folder/package.json');
 * console.log(noPackageJson); // true
 * @param  {...string} args File or folder path(s)
 * @return {boolean} All files/paths do not exist (true) or some do (false)
 */


exports.someDoExist = someDoExist;

const allDoNotExist =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2.default)(function* (...args) {
    const checks = yield Promise.all(args.map(val => (0, _fsExtra.pathExists)((0, _path.join)(process.cwd(), val))));
    return checks.every(val => !val);
  });

  return function allDoNotExist() {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Format input code using Prettier
 * @param {*} [code=''] Code to be formatted
 * @example <caption>Prettier options</caption>
 * {
 *     bracketSpacing: false,
 *     parser: 'json-stringify',
 *     printWidth: 80,
 *     tabWidth: 4,
 *     quotes: true
 * }
 * @return {string} Code formatted by Prettier
 */


exports.allDoNotExist = allDoNotExist;

const format = (code = {}) => _prettier.default.format(JSON.stringify(code), PRETTIER_OPTIONS).replace(/"/g, '');
/**
 * Use string-similarity module to determine closest matching string
 * @param {Object} commands Object with commands as key values, terms as key values for each command object
 * @param {string} command Command string input
 * @param {string[]} [terms=[]] Terms input
 * @example
 * const [intendedCommand, intendedTerms] = getIntendedInput(commands, command, terms);
 * @return {string[]} [intendedCommand, intendedTerms] Array destructed assignment is recommended (see example)
 */


exports.format = format;

const getIntendedInput = (commands, command, terms = []) => {
  const VALID_COMMANDS = Object.keys(commands);
  const {
    bestMatch: {
      target: intendedCommand
    }
  } = (0, _stringSimilarity.findBestMatch)(command, VALID_COMMANDS);
  const VALID_TERMS = Object.keys(commands[intendedCommand]);
  const intendedTerms = terms.map(term => (0, _stringSimilarity.findBestMatch)(term, VALID_TERMS).bestMatch.target);
  return [intendedCommand, intendedTerms];
};
/**
 * Use npm CLI to return array of module versions
 * @param {string} name npm module name
 * @example
 * const versions = getVersions('react');
 * @return {string[]} Array of versions
 */


exports.getIntendedInput = getIntendedInput;

const getVersions =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2.default)(function* (name = '') {
    return name.length === 0 ? [] : (yield (0, _execa.default)('npm', ['view', name, 'versions'])).stdout.split(',\n').map(str => str.match(/\d+[.]\d+[.]\d+/)).map(_lodash.first).map(_semver.default.valid).filter(Boolean);
  });

  return function getVersions() {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * Install dependencies with npm
 * @param {string[]} [dependencies=[]] Modules to install
 * @param {Object} options Options to configure installation
 * @param {boolean} [options.dev=false] If true, add "--save-dev"
 * @param {boolean} [options.latest=true] If true, add "@latest" to all module names
 * @param {boolean} [options.skipInstall=false] Do not install (mostly for testing)
 * @example <caption>Install production dependencies</caption>
 * install(['react']);
 * @example <caption>Install development dependencies</caption>
 * install(['jest', 'babel-jest'], {dev: true});
 * @return {string[]} Array of inputs (mostly for testing)
 */


exports.getVersions = getVersions;

const install =
/*#__PURE__*/
function () {
  var _ref5 = (0, _asyncToGenerator2.default)(function* (dependencies = [], options = {
    dev: false,
    latest: true,
    skipInstall: false
  }) {
    const {
      dev,
      latest,
      skipInstall
    } = options;

    const identity = i => i;

    const concat = val => str => str + val;

    const args = ['install'].concat(dependencies.map(latest ? concat('@latest') : identity)).concat(dev ? '--save-dev' : []);
    skipInstall || (yield (0, _execa.default)('npm', args));
    return args;
  });

  return function install() {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * Determine if system supports Rust (necessary Rust dependencies are installed)
 * @return {boolean} Are Rust components installed?
 */


exports.install = install;

const verifyRustInstallation = () => {};

exports.verifyRustInstallation = verifyRustInstallation;

const silent = () => {};
/**
 * Base class to serve as base for JSON and module builder classes
 */


class BasicEditor {
  constructor() {
    const fs = _memFsEditor.default.create(_memFs.default.create());

    const queue = new _pQueue.default({
      concurrency: 1
    });
    assign(this, {
      fs,
      queue
    });
  }
  /**
   *
   * @param {string} destination Destination to copy file
   * @return {BasicEditor} Chaining OK
   */


  copy(destination) {
    const self = this;
    const {
      fs,
      path,
      queue
    } = self;
    const [filename] = path.split('/').reverse();
    queue.add(() => fs.copy(path, (0, _path.join)(destination, filename)));
    return self;
  }
  /**
   * @return {BasicEditor} Chaining OK
   */


  delete() {
    const self = this;
    const {
      fs,
      path,
      queue
    } = self;
    queue.add(() => fs.delete(path));
    return self;
  }
  /**
   * Write changes to disk
   * @return {Promise} Resolves when queue is empty
   */


  commit() {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      const {
        fs,
        queue
      } = _this;
      yield new Promise(resolve => fs.commit(resolve));
      yield queue.onEmpty();
    })();
  }

}
/**
 * Create and edit a JSON file with a fluent API
 * @param {string} filename Name of file to edit
 * @param {object} [contents={}] Contents of file
 * @return {JsonEditor} JsonEditor class (extends {@link BasicEditor})
 */


exports.BasicEditor = BasicEditor;

const createJsonEditor = (filename, contents = {}) => {
  var _temp;

  return _temp = class JsonEditor extends BasicEditor {
    constructor(cwd = process.cwd()) {
      super();
      (0, _defineProperty2.default)(this, "contents", contents);
      const path = (0, _path.join)(cwd, filename);
      assign(this, {
        path
      });
    }

    create() {
      const self = this;
      const {
        contents,
        fs,
        path,
        queue
      } = self;
      (0, _fsExtra.existsSync)(path) || queue.add(() => fs.writeJSON(path, contents, null, INDENT_SPACES));
      return self;
    }

    read() {
      const {
        fs,
        path
      } = this;
      return fs.readJSON(path) || '';
    }

    extend(contents) {
      const self = this;
      const {
        fs,
        path,
        queue
      } = self;
      queue.add(() => fs.extendJSON(path, contents, null, INDENT_SPACES));
      return self;
    }
    /**
     * Check if package.json manifest file has dependencies (dependencies or devDependencies)
     * @param  {...string} modules npm module names
     * @return {Boolean} Has at least one dependency (true) or none (false)
     */


    hasSome(...modules) {
      const {
        keys
      } = Object;

      const parse = data => JSON.parse(JSON.stringify(data));

      const pkg = this.read();
      const {
        dependencies,
        devDependencies
      } = parse(pkg);
      const installed = [...keys(dependencies), ...keys(devDependencies)];
      return modules.some(module => installed.includes(module));
    }
    /**
     * Check if package.json manifest file has dependencies (dependencies or devDependencies)
     * @param  {...string} modules npm module names
     * @return {Boolean} Has all dependencies (true) or not all (false)
     */


    hasAll(...modules) {
      const {
        keys
      } = Object;

      const parse = data => JSON.parse(JSON.stringify(data));

      const pkg = this.read();
      const {
        dependencies,
        devDependencies
      } = parse(pkg);
      const installed = [...keys(dependencies), ...keys(devDependencies)];
      return modules.every(module => installed.includes(module));
    }

  }, _temp;
};
/**
 * Create and edit a JS module with a fluent API
 * @param {string} filename Name of file to edit
 * @param {string} [contents='module.exports = {};'] Contents of file
 * @param {string} [prependedContents=''] Content prepended to top of file
 * @return {ModuleEditor} ModuleEditor class (extends {@link BasicEditor})
 */


exports.createJsonEditor = createJsonEditor;

const createModuleEditor = (filename, contents = 'module.exports = {};', prependedContents = '') => {
  var _temp2;

  return _temp2 = class ModuleEditor extends BasicEditor {
    constructor(cwd = process.cwd()) {
      super();
      (0, _defineProperty2.default)(this, "contents", contents);
      (0, _defineProperty2.default)(this, "prependedContents", prependedContents);
      (0, _defineProperty2.default)(this, "created", false);
      const path = (0, _path.join)(cwd, filename);
      assign(this, {
        path
      });
    }

    create(...args) {
      const self = this;
      const {
        contents,
        path
      } = self;
      self.created || (0, _fsExtra.existsSync)(path) || self.write(contents, ...args);
      return self;
    }

    read() {
      const {
        fs,
        path
      } = this;
      return fs.exists(path) ? fs.read(path) : '';
    }

    write(content) {
      const self = this;
      const {
        fs,
        path,
        prependedContents,
        queue
      } = self;
      const formatted = `${prependedContents}module.exports = ${format(content)}`.replace(/\r*\n$/g, ';');
      queue.add(() => fs.write(path, formatted)).then(() => self.created = (0, _fsExtra.existsSync)(path)).catch(silent);
      return self;
    }

    extend(code) {
      this.contents = (0, _lodash.merge)(contents, code);
      this.write(this.contents);
      return this;
    }

    prepend(code) {
      const self = this;
      const {
        contents,
        prependedContents
      } = self;
      self.prependedContents = `${code}\n${prependedContents}`.replace(/\n*$/, '\n\n');
      self.write(contents);
      return self;
    }

  }, _temp2;
};
/**
 * Class to create scaffolders when creating folders, and copying files/templates
 * @example
 * import {Scaffolder} from './utils';
 * const scaffolder = new Scaffolder();
 * await scaffolder
 *     .target('/path/to/copy/files')
 *     .copy('foo.js')
 *     .copy('bar.js')
 *     .commit();
 */


exports.createModuleEditor = createModuleEditor;

class Scaffolder {
  /**
   *
   * @param {Object} options Scaffolding options
   * @param {string} options.sourceDirectory Source directory for template files
   */
  constructor(options = {
    sourceDirectory: (0, _path.join)(__dirname, 'templates')
  }) {
    const {
      sourceDirectory
    } = options;
    const targetDirectory = './';

    const fs = _memFsEditor.default.create(_memFs.default.create());

    const queue = new _pQueue.default({
      concurrency: 1
    });
    assign(this, {
      fs,
      queue,
      sourceDirectory,
      targetDirectory
    });
  }
  /**
   * Set source directory
   * @param {string} path Source directory of template files
   * @returns {Scaffolder} Chaining OK
   */


  source(path) {
    this.sourceDirectory = path;
    return this;
  }
  /**
   * Set target directory
   * @param {string} path Target directory of template files
   * @returns {Scaffolder} Chaining OK
   */


  target(path) {
    this.targetDirectory = path;
    return this;
  }
  /**
   * Copy a file
   * @param {string} path Path string of file to be copied
   * @returns {Scaffolder} Chaining OK
   */


  copy(path) {
    const self = this;
    const {
      fs,
      queue,
      sourceDirectory,
      targetDirectory
    } = self;
    const source = (0, _path.join)(sourceDirectory, path);
    const target = (0, _path.join)(process.cwd(), targetDirectory, ...path.split('/'));
    queue.add(() => fs.copy(source, target)).catch(silent);
    return self;
  }
  /**
   * Write changes to disk
   * @return {Promise} Resolves when queue is empty
   */


  commit() {
    var _this2 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      const {
        fs,
        queue
      } = _this2;
      yield new Promise(resolve => fs.commit(resolve));
      yield queue.onEmpty();
    })();
  }

}
/**
 * Create and edit a Babel.js configuration file with a fluent API
 * @type {ModuleEditor}
 * @example <caption>Extend module.exports content and prepend text to the top of the file</caption>
 * const cfg = new BabelConfigModuleEditor();
 * await cfg
 *     .create()
 *     .extend({
 *         presets: [`'@babel/preset-env'`]
 *     })
 *     .prepend(`const {existsSync} = require('fs-extra');`)
 *     .commit();
 */


exports.Scaffolder = Scaffolder;
const BabelConfigModuleEditor = createModuleEditor('babel.config.js', {
  plugins: [`'@babel/plugin-transform-runtime'`, `'@babel/plugin-proposal-class-properties'`, `'@babel/plugin-proposal-export-default-from'`, `'@babel/plugin-proposal-optional-chaining'`],
  presets: [`'@babel/preset-env'`]
});
/**
 * Create and edit an ESLint configuration file with a fluent API
 * @type {ModuleEditor}
 * @example
 * const cfg = new EslintConfigModuleEditor();
 * await cfg.create().commit();
 */

exports.BabelConfigModuleEditor = BabelConfigModuleEditor;
const EslintConfigModuleEditor = createModuleEditor('.eslintrc.js', {
  env: {
    es6: true,
    jest: true
  },
  extends: [`'omaha-prime-grade'`],
  parser: `'babel-eslint'`
});
/**
 * Create and edit a package.json manifest file with a fluent API
 * @type {JsonEditor}
 * @example <caption>Create a new package.json</caption>
 * const pkg = new PackageJsonEditor();
 * await pkg.create().commit();
 * @example <caption>Create a new package.json and read its contents (chaining OK)</caption>
 * const pkg = new PackageJsonEditor();
 * const contents = pkg.create().read();
 * @example <caption>Extend a package.json</caption>
 * const script = {test: 'jest --coverage'};
 * await pkg.extend({script}).commit();
 * @example <caption>Create and extend a package.json without writing to disk (chaining OK)</caption>
 * const script = {
 *     lint: 'eslint index.js -c ./.eslintrc.js'
 * };
 * await pkg
 *     .create(false)
 *     .extend({script}, false)
 *     .commit();
 */

exports.EslintConfigModuleEditor = EslintConfigModuleEditor;
const PackageJsonEditor = createJsonEditor('package.json', {
  name: 'my-project',
  version: '0.0.0',
  description: 'A super cool app/server/tool/library/widget/thingy',
  license: 'MIT',
  keywords: []
});
/**
 * Create and edit an PostCSS configuration file with a fluent API
 * @type {ModuleEditor}
 * @example
 * const cfg = new PostcssConfigEditor();
 * await cfg.create().commit();
 */

exports.PackageJsonEditor = PackageJsonEditor;
const PostcssConfigEditor = createModuleEditor('postcss.config.js', {
  parser: `require('postcss-safe-parser')`,
  processors: [`require('stylelint')()`, `require('postcss-import')()`, `require('postcss-cssnext')()`, `require('uncss').postcssPlugin({html: ['index.html']})`, `require('cssnano')()`, `require('postcss-reporter')({clearReportedMessages: true})`]
});
/**
 * Create and edit a Webpack configuration file with a fluent API
 * @type {ModuleEditor}
 * @example
 * const cfg = new WebpackConfigEditor();
 * await cfg.create().commit();
 */

exports.PostcssConfigEditor = PostcssConfigEditor;
const WebpackConfigEditor = createModuleEditor('webpack.config.js', {
  mode: `'development'`,
  entry: {
    app: `'./src/main.js'`
  },
  output: {
    path: `resolve('./dist')`,
    filename: `'bundle.min.js'`
  },
  module: {
    rules: [{
      test: `/\.js?$/`,
      exclude: `/node_modules/`,
      loader: `'babel-loader'`,
      query: {
        presets: [`'@babel/env'`]
      }
    }]
  },
  plugins: [`new DashboardPlugin()`]
});
exports.WebpackConfigEditor = WebpackConfigEditor;