"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.string.replace");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.createModuleEditor = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _path = require("path");

var _fsExtra = require("fs-extra");

var _lodash = require("lodash");

var _common = require("./common");

var _BasicEditor = _interopRequireDefault(require("./BasicEditor"));

const {
  assign
} = Object;

const silent = () => {};
/**
 * Create and edit a JS module with a fluent API
 * @param {string} filename Name of file to edit
 * @param {string} [contents='module.exports = {};'] Contents of file
 * @param {string} [prependedContents=''] Content prepended to top of file
 * @return {ModuleEditor} ModuleEditor class (extends {@link BasicEditor})
 */


const createModuleEditor = (filename, contents = 'module.exports = {};', prependedContents = '') => {
  var _temp;

  return _temp = class ModuleEditor extends _BasicEditor.default {
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

    create() {
      const self = this;
      const {
        contents,
        path
      } = self;
      self.created || (0, _fsExtra.existsSync)(path) || self.write(contents);
      return self;
    }

    read() {
      const {
        fs,
        path
      } = this;
      return fs.exists(path) ? fs.read(path) : '';
    }

    write(contents) {
      const self = this;
      const {
        fs,
        path,
        prependedContents,
        queue
      } = self;
      const formatted = `${prependedContents}module.exports = ${(0, _common.format)(contents)}`.replace(/\r*\n$/g, ';');
      queue.add(() => fs.write(path, formatted)).then(() => self.created = (0, _fsExtra.existsSync)(path)).catch(silent);
      return assign(self, {
        contents
      });
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
      return self.write(contents);
    }

  }, _temp;
};

exports.createModuleEditor = createModuleEditor;
var _default = createModuleEditor;
exports.default = _default;