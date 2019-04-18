"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = require("path");

var _execa = _interopRequireDefault(require("execa"));

var _pQueue = _interopRequireDefault(require("p-queue"));

var _prettier = _interopRequireDefault(require("prettier"));

var _lodash = require("lodash");

var _fsExtra = require("fs-extra");

var _memFs = _interopRequireDefault(require("mem-fs"));

var _memFsEditor = _interopRequireDefault(require("mem-fs-editor"));

var _stringSimilarity = require("string-similarity");

/**
 * @file Utility functions for tomo
 * @author Jason Wohlgemuth
 * @module utils
 */
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
};
/**
 * @async
 * @function someDoExist
 * @param  {...string} args File or folder path(s)
 * @return {boolean} Some files/path do exist (true) or all do not exist (false)
 */

const someDoExist =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (...args) {
    const checks = yield Promise.all(args.map(val => (0, _fsExtra.pathExists)((0, _path.join)(process.cwd(), val))));
    return checks.some(Boolean);
  });

  return function someDoExist() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @async
 * @function allDoNotExist
 * @param  {...string} args File or folder path(s)
 * @return {boolean} All files/paths do not exist (true) or some do (false)
 */


const allDoNotExist =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (...args) {
    const checks = yield Promise.all(args.map(val => (0, _fsExtra.pathExists)((0, _path.join)(process.cwd(), val))));
    return checks.every(val => !val);
  });

  return function allDoNotExist() {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @function format
 * @description Format input code using Prettier
 * @param {*} [code=''] Code to be formatted
 * @return {string} Code formatted by Prettier
 */


const format = (code = '') => _prettier.default.format(JSON.stringify(code), PRETTIER_OPTIONS).replace(/"/g, '');
/**
 * @private
 * @function getIntendedInput
 * @param {Object} commands Object with commands as key values, terms as key values for each command object
 * @param {string} command Command string input
 * @param {string[]} [terms=[]] Terms input
 * @example
 * const [intendedCommand, intendedTerms] = getIntendedInput(commands, command, terms);
 * @return {string[]} [intendedCommand, intendedTerms] Array destructed assignment is recommended (see example)
 */


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
 * @async
 * @function getVersions
 * @description Use npm CLI to return array of module versions
 * @param {string} name npm module name
 * @return {string[]} Array of versions
 */


const getVersions =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2.default)(function* (name = '') {
    return name.length === 0 ? [] : (yield (0, _execa.default)('npm', ['view', name, 'versions'])).stdout.split(',\n').map(str => str.match(/\d+[.]\d+[.]\d+/)).map(_lodash.first);
  });

  return function getVersions() {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * @async
 * @function install
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


const install =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2.default)(function* (dependencies = [], options = {
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
    return _ref4.apply(this, arguments);
  };
}();
/**
 * @function verifyRustInstallation
 * @return {boolean} Are Rust components installed?
 */


const verifyRustInstallation = () => {};
/**
 * @private
 * @class BasicEditor
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

  copy(destination, shouldCommit = true) {
    const self = this;
    const {
      fs,
      path,
      queue
    } = self;
    const [filename] = path.split('/').reverse();
    queue.add(() => fs.copy(path, (0, _path.join)(destination, filename)));
    shouldCommit && queue.add(() => self.commit());
    return self;
  }

  delete(shouldCommit = true) {
    const self = this;
    const {
      fs,
      path,
      queue
    } = self;
    queue.add(() => fs.delete(path));
    shouldCommit && queue.add(() => self.commit());
    return self;
  }

  done() {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      return yield _this.queue.onEmpty();
    })();
  }

  commit() {
    var _this2 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      const {
        fs
      } = _this2;
      yield new Promise(resolve => fs.commit(resolve));
      yield _this2.done();
    })();
  }

}
/**
 * @function createJsonEditor
 * @param {string} filename Name of file to edit
 * @param {object} [contents={}] Contents of file
 * @return {JsonEditor} JsonEditor class (extends BasicEditor)
 */


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

    create(shouldCommit = true) {
      const self = this;
      const {
        contents,
        fs,
        path,
        queue
      } = self;

      if (!(0, _fsExtra.existsSync)(path)) {
        queue.add(() => fs.writeJSON(path, contents, null, INDENT_SPACES));
        shouldCommit && queue.add(() => self.commit());
      }

      return self;
    }

    read() {
      const {
        fs,
        path
      } = this;
      return fs.readJSON(path) || '';
    }

    extend(contents, shouldCommit = true) {
      const self = this;
      const {
        fs,
        path,
        queue
      } = self;
      queue.add(() => fs.extendJSON(path, contents, null, INDENT_SPACES));
      shouldCommit && queue.add(() => self.commit());
      return self;
    }

  }, _temp;
};
/**
 * @function createModuleEditor
 * @param {string} filename Name of file to edit
 * @param {string} [contents='module.exports = {};'] Contents of file
 * @param {string} [prependedContents=''] Content prepended to top of file
 * @return {ModuleEditor} ModuleEditor class (extends BasicEditor)
 */


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
        path,
        queue
      } = self;
      self.created || (0, _fsExtra.existsSync)(path) || queue.add(() => self.write(contents, ...args)).then(() => self.created = (0, _fsExtra.existsSync)(path));
      return self;
    }

    read() {
      const {
        fs,
        path
      } = this;
      return fs.exists(path) ? fs.read(path) : '';
    }

    write(content, shouldCommit = true) {
      const self = this;
      const {
        fs,
        path,
        prependedContents,
        queue
      } = self;
      const formatted = `${prependedContents}module.exports = ${format(content)}`.replace(/\r*\n$/g, ';');
      queue.add(() => fs.write(path, formatted));
      shouldCommit && queue.add(() => self.commit());
    }

    extend(code, shouldCommit = true) {
      this.contents = (0, _lodash.merge)(contents, code);
      this.write(this.contents, shouldCommit);
      return this;
    }

    prepend(code, shouldCommit = true) {
      const self = this;
      const {
        contents,
        prependedContents,
        queue
      } = self;
      self.prependedContents = `${code}\n${prependedContents}`.replace(/\n*$/, '\n\n');
      self.write(contents, shouldCommit);
      shouldCommit && queue.add(() => self.commit());
      return self;
    }

  }, _temp2;
};
/**
 * @class Scaffolder
 * @description Class to create scaffolders when creating folders, and copying files/templates
 * @param {Object} options Configure scaffolder
 * @param {string} [options.sourceDirectory='<__dirname>/templates'] Root directory to look for templates
 * @example
 * import {Scaffolder} from './utils';
 * const scaffolder = new Scaffolder();
 * await scaffolder
 *     .target('/path/to/copy/files')
 *     .copy('foo.js')
 *     .copy('bar.js')
 *     .commit();
 */


class Scaffolder {
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

  source(path) {
    this.sourceDirectory = path;
    return this;
  }

  target(path) {
    this.targetDirectory = path;
    return this;
  }

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
    queue.add(() => fs.copy(source, target));
    return self;
  }

  commit() {
    var _this3 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      const {
        fs,
        queue
      } = _this3;
      yield new Promise(resolve => fs.commit(resolve));
      yield queue.onEmpty();
    })();
  }

}
/**
 * @class BabelConfigModuleEditor
 * @extends ModuleEditor
 * @example <caption>Extend module.exports content and prepend text to the top of the file</caption>
 * const cfg = new BabelConfigModuleEditor();
 * cfg
 *     .create()
 *     .extend({
 *         presets: [`'@babel/preset-env'`]
 *     })
 *     .prepend(`const {existsSync} = require('fs-extra');`);
 */


const BabelConfigModuleEditor = createModuleEditor('babel.config.js', {
  plugins: [`'@babel/plugin-transform-runtime'`, `'@babel/plugin-proposal-class-properties'`, `'@babel/plugin-proposal-export-default-from'`, `'@babel/plugin-proposal-optional-chaining'`],
  presets: [`'@babel/preset-env'`]
});
/**
 * @class EslintConfigModuleEditor
 * @extends ModuleEditor
 * @example
 * const cfg = new EslintConfigModuleEditor();
 * cfg.create();
 */

const EslintConfigModuleEditor = createModuleEditor('.eslintrc.js', {
  env: {
    es6: true,
    jest: true
  },
  extends: [`'omaha-prime-grade'`],
  parser: `'babel-eslint'`
});
/**
 * @class PackageJsonEditor
 * @extends JsonEditor
 * @example <caption>Create a new package.json</caption>
 * const pkg = new PackageJsonEditor();
 * pkg.create();
 * @example <caption>Create a new package.json and read its contents (chaining OK)</caption>
 * const pkg = new PackageJsonEditor();
 * const contents = pkg.create().read();
 * @example <caption>Extend a package.json</caption>
 * pkg.extend({
 *     script: {
 *         test: 'jest --coverage'
 *     }
 * });
 * @example <caption>Create and extend a package.json without writing to disk (chaining OK)</caption>
 * pkg
 *     .create(false)
 *     .extend({
 *         script: {
 *             lint: 'eslint index.js -c ./.eslintrc.js'
 *         }
 *     }, false);
 */

const PackageJsonEditor = createJsonEditor('package.json', {
  name: 'my-project',
  version: '0.0.0',
  description: 'A super cool app/server/tool/library/widget/thingy',
  license: 'MIT',
  keywords: []
});
/**
 * @class PostcssConfigEditor
 * @extends ModuleEditor
 * @example
 * const cfg = new PostcssConfigEditor();
 * cfg.create();
 */

const PostcssConfigEditor = createModuleEditor('postcss.config.js', {
  parser: `require('postcss-safe-parser')`,
  processors: [`require('stylelint')()`, `require('postcss-import')()`, `require('postcss-cssnext')()`, `require('uncss').postcssPlugin({html: ['index.html']})`, `require('cssnano')()`, `require('postcss-reporter')({clearReportedMessages: true})`]
});
module.exports = {
  allDoNotExist,
  someDoExist,
  format,
  getIntendedInput,
  getVersions,
  install,
  createJsonEditor,
  createModuleEditor,
  BabelConfigModuleEditor,
  EslintConfigModuleEditor,
  PackageJsonEditor,
  PostcssConfigEditor,
  Scaffolder,
  verifyRustInstallation
};