"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Scaffolder = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = require("path");

var _pQueue = _interopRequireDefault(require("p-queue"));

var _memFs = _interopRequireDefault(require("mem-fs"));

var _memFsEditor = _interopRequireDefault(require("mem-fs-editor"));

const {
  assign
} = Object;

const silent = () => {};
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
   * @param {string} sourceDirectory Source directory of template files
   * @returns {Scaffolder} Chaining OK
   */


  source(sourceDirectory) {
    return assign(this, {
      sourceDirectory
    });
  }
  /**
   * Set target directory
   * @param {string} targetDirectory Target directory of template files
   * @returns {Scaffolder} Chaining OK
   */


  target(targetDirectory) {
    return assign(this, {
      targetDirectory
    });
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

exports.Scaffolder = Scaffolder;
var _default = Scaffolder;
exports.default = _default;