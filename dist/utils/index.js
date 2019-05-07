"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebpackConfigEditor = exports.PostcssConfigEditor = exports.PackageJsonEditor = exports.EslintConfigModuleEditor = exports.BabelConfigModuleEditor = exports.verifyRustInstallation = exports.install = exports.getVersions = exports.getIntendedInput = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _execa = _interopRequireDefault(require("execa"));

var _semver = _interopRequireDefault(require("semver"));

var _lodash = require("lodash");

var _stringSimilarity = require("string-similarity");

var _createJsonEditor = _interopRequireDefault(require("./createJsonEditor"));

var _createModuleEditor = _interopRequireDefault(require("./createModuleEditor"));

/**
 * Use string-similarity module to determine closest matching string
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
  return {
    intendedCommand,
    intendedTerms
  };
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
  var _ref = (0, _asyncToGenerator2.default)(function* (name = '') {
    return name.length === 0 ? [] : (yield (0, _execa.default)('npm', ['view', name, 'versions'])).stdout.split(',\n').map(str => str.match(/\d+[.]\d+[.]\d+/)).map(_lodash.first).map(_semver.default.valid).filter(Boolean);
  });

  return function getVersions() {
    return _ref.apply(this, arguments);
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
  var _ref2 = (0, _asyncToGenerator2.default)(function* (dependencies = [], options = {
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
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Determine if system supports Rust (necessary Rust dependencies are installed)
 * @return {boolean} Are Rust components installed?
 */


exports.install = install;

const verifyRustInstallation = () => {};
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


exports.verifyRustInstallation = verifyRustInstallation;
const BabelConfigModuleEditor = (0, _createModuleEditor.default)('babel.config.js', {
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
const EslintConfigModuleEditor = (0, _createModuleEditor.default)('.eslintrc.js', {
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
const PackageJsonEditor = (0, _createJsonEditor.default)('package.json', {
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
const PostcssConfigEditor = (0, _createModuleEditor.default)('postcss.config.js', {
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
const WebpackConfigEditor = (0, _createModuleEditor.default)('webpack.config.js', {
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