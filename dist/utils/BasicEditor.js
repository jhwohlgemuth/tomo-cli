"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BasicEditor = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = require("path");

var _pQueue = _interopRequireDefault(require("p-queue"));

var _memFs = _interopRequireDefault(require("mem-fs"));

var _memFsEditor = _interopRequireDefault(require("mem-fs-editor"));

const {
  assign
} = Object;
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

  done() {
    return this.queue.onEmpty();
  }
  /**
   * Write changes to disk
   * @return {Promise} Resolves when queue is empty
   */


  commit() {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      const {
        fs
      } = _this;
      yield new Promise(resolve => fs.commit(resolve));
      yield _this.done();
    })();
  }

}

exports.BasicEditor = BasicEditor;
var _default = BasicEditor;
exports.default = _default;