"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.tasks = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = require("path");

var _utils = require("../../utils");

const MARIONETTE_DEPENDENCIES = ['backbone', 'backbone.marionette', 'backbone.radio', 'handlebars', 'lodash', 'redux'];

const ALWAYS =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* () {
    return true;
  });

  return function ALWAYS() {
    return _ref.apply(this, arguments);
  };
}();

const sourceDirectory = (0, _path.join)(__dirname, 'templates');
const scaffolder = new _utils.Scaffolder({
  sourceDirectory
});
/** @ignore */

const tasks = [{
  text: 'Add Marionette.js boilerplate',
  task: function () {
    var _ref2 = (0, _asyncToGenerator2.default)(function* ({
      sourceDirectory
    }) {
      yield scaffolder.target(sourceDirectory).copy('index.html').copy('main.js').copy('app.js').target(`${sourceDirectory}/plugins`).copy('mn.radio.logging.js').copy('mn.redux.state.js').target(`${sourceDirectory}/shims`).copy('mn.renderer.shim.js').commit();
    });

    return function task(_x) {
      return _ref2.apply(this, arguments);
    };
  }(),
  condition: ALWAYS
}, {
  text: 'Add CSS assets',
  task: function () {
    var _ref3 = (0, _asyncToGenerator2.default)(function* () {
      yield scaffolder.target('assets/css').copy('style.css').commit();
    });

    return function task() {
      return _ref3.apply(this, arguments);
    };
  }(),
  condition: ALWAYS
}, {
  text: 'Add template assets',
  task: function () {
    var _ref4 = (0, _asyncToGenerator2.default)(function* ({
      sourceDirectory
    }) {
      yield scaffolder.target(`${sourceDirectory}/shims`).copy('mn.templates.shim.js').target('assets/templates').copy('example.hbs').commit();
    });

    return function task(_x2) {
      return _ref4.apply(this, arguments);
    };
  }(),
  condition: ALWAYS
}, {
  text: 'Install Marionette.js dependencies',
  task: ({
    skipInstall
  }) => (0, _utils.install)(MARIONETTE_DEPENDENCIES, {
    skipInstall
  }),
  condition: () => (0, _utils.someDoExist)('package.json')
}];
exports.tasks = tasks;
var _default = tasks;
exports.default = _default;