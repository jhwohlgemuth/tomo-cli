"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.createJsonEditor = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _path = require("path");

var _fsExtra = require("fs-extra");

var _BasicEditor = _interopRequireDefault(require("./BasicEditor"));

var _common = require("./common");

const {
  assign
} = Object;
const INDENT_SPACES = 4;
/**
 * Create and edit a JSON file with a fluent API
 * @param {string} filename Name of file to edit
 * @param {object} [contents={}] Contents of file
 * @return {JsonEditor} JsonEditor class (extends {@link BasicEditor})
 */

const createJsonEditor = (filename, contents = {}) => {
  var _temp;

  return _temp = class JsonEditor extends _BasicEditor.default {
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
      const pkg = this.read();
      const {
        dependencies,
        devDependencies
      } = (0, _common.parse)(pkg);
      const installed = [...keys(dependencies ? dependencies : {}), ...keys(devDependencies ? devDependencies : {})];
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
      const pkg = this.read();
      const {
        dependencies,
        devDependencies
      } = (0, _common.parse)(pkg);
      const installed = [...keys(dependencies ? dependencies : {}), ...keys(devDependencies ? devDependencies : {})];
      return modules.every(module => installed.includes(module));
    }

  }, _temp;
};

exports.createJsonEditor = createJsonEditor;
var _default = createJsonEditor;
exports.default = _default;