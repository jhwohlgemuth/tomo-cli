"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _common = require("./common");

var _addA11y = _interopRequireDefault(require("./add-a11y"));

var _addBabel = _interopRequireDefault(require("./add-babel"));

var _addEsdoc = _interopRequireDefault(require("./add-esdoc"));

var _addEslint = _interopRequireDefault(require("./add-eslint"));

var _addJest = _interopRequireDefault(require("./add-jest"));

var _addMakefile = _interopRequireDefault(require("./add-makefile"));

var _addMarionette = _interopRequireDefault(require("./add-marionette"));

var _addPostcss = _interopRequireDefault(require("./add-postcss"));

var _addWebpack = _interopRequireDefault(require("./add-webpack"));

/* eslint-disable no-magic-numbers */
const createProject = [..._common.createPackageJson, ..._common.createSourceDirectory, ..._addBabel.default, ..._addEslint.default, ..._addJest.default];
const create = {
  project: createProject,
  app: [...createProject, ..._addMarionette.default],
  server: [...createProject]
};
const add = {
  a11y: _addA11y.default,
  babel: _addBabel.default,
  esdoc: _addEsdoc.default,
  eslint: [..._addBabel.default, ..._addEslint.default],
  jest: [..._addBabel.default, ..._addJest.default],
  makefile: _addMakefile.default,
  postcss: _addPostcss.default,
  webpack: [..._addBabel.default, ..._addWebpack.default]
};
module.exports = {
  add,
  create,
  new: create // alias for create

};
/**
 * @typedef {Object} task
 * @property {string} text Display text for task
 * @property {function} task Task to execute
 * @property {function} condition Predicate to decide when to execute the task (true) or not (false)
 * @property {function} [optional] Predicate to decide when to show the task (true) or not (false)
 */