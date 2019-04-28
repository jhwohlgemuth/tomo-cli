"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MakefileEditor = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _negate2 = _interopRequireDefault(require("lodash/negate"));

var _last2 = _interopRequireDefault(require("lodash/last"));

var _kebabCase2 = _interopRequireDefault(require("lodash/kebabCase"));

var _flow2 = _interopRequireDefault(require("lodash/flow"));

var _fsExtra = require("fs-extra");

var _createJsonEditor = _interopRequireDefault(require("./createJsonEditor"));

var _createModuleEditor = _interopRequireDefault(require("./createModuleEditor"));

var _common = require("./common");

const {
  assign,
  entries
} = Object;
const {
  isArray
} = Array;
const isNotArray = (0, _negate2.default)(isArray);

const silent = () => {};

const isLocalNpmCommand = (command, path = process.cwd()) => {
  const [packageDirectory] = path.split('Makefile');
  const Editor = (0, _createJsonEditor.default)('package.json');
  const pkg = new Editor(packageDirectory);
  const pkgHasCommmand = pkg.hasAll(command);
  const binHasCommand = (0, _fsExtra.existsSync)(`${(0, _common.getBinDirectory)(path)}${command}`);
  return pkgHasCommmand || binHasCommand;
};
/**
 * Create and edit Makefiles. Includes ability to import package.json scripts.
 */


class MakefileEditor extends (0, _createModuleEditor.default)('Makefile') {
  constructor(path = process.cwd()) {
    super(path);
    (0, _defineProperty2.default)(this, "contents", '');
    (0, _defineProperty2.default)(this, "scripts", {});
    (0, _defineProperty2.default)(this, "useBinVariable", false);
  }

  write(contents) {
    const self = this;
    const {
      fs,
      path,
      queue
    } = self;
    queue.add(() => fs.write(path, contents)).then(() => self.created = (0, _fsExtra.existsSync)(path)).catch(silent);
    return assign(self, {
      contents
    });
  }
  /**
   * Append line(s) to end of Makefile
   * @param {(string|Symbol)} [lines=Symbol('skip')] Lines to append
   * @return {MakefileEditor} Chaining OK
   */


  append(lines = Symbol('skip')) {
    const {
      contents
    } = this;
    const shouldSkip = typeof lines === 'symbol';
    return shouldSkip ? this : this.write(`${contents}\n${lines}`);
  }
  /**
   * Prepend line(s) to top of Makefile (similar API to {@link MakefileEditor#append})
   * @param {(string|Symbol)} [lines=Symbol('skip')] Lines to append
   * @return {MakefileEditor} Chaining OK
   */


  prepend(lines = Symbol('skip')) {
    const {
      contents
    } = this;
    const shouldSkip = typeof lines === 'symbol';
    return shouldSkip ? this : this.write(`${lines}\n${contents}`);
  }
  /**
   * Format task and remove package.json dependency by replacing npm with make and such
   * @param {string} action Task action
   * @param {object} scripts Scripts object imported from package.json (must run {@link MakefileEditor#importScripts} first)
   * @return {string} Formatted action
   */


  formatTask(action, scripts = {}) {
    const {
      path
    } = this;

    const formatTaskName = val => (0, _kebabCase2.default)((0, _last2.default)(val.split(' ')));

    const replaceNpmRunQuotes = initial => {
      const re = /['"]npm run .[^"]*['"]/g;
      const matches = action.match(re);
      return isNotArray(matches) ? initial : matches.reduce((acc, match) => acc.replace(match, `'make ${formatTaskName(match)}'`), initial);
    };

    const replaceNpmWithArguments = initial => {
      const re = /npm .* -- --.*/g;
      const matches = action.match(re);
      return isNotArray(matches) ? initial : matches.reduce((acc, match) => {
        const [commands, options] = match.split(' -- ');
        const task = (0, _last2.default)(commands.split(' '));
        return acc.replace(match, `${scripts[task]} ${options}`);
      }, initial);
    };

    const replaceNpmRunCommands = initial => {
      const re = /^npm run .*/g;
      const matches = action.match(re);
      return isNotArray(matches) ? initial : matches.reduce((acc, match) => acc.replace(match, `$(MAKE) ${formatTaskName(match)}`), initial);
    };

    const formatted = (0, _flow2.default)(replaceNpmRunQuotes, replaceNpmWithArguments, replaceNpmRunCommands)(action);
    const [command] = formatted.split(' ');
    const useBinVariable = isLocalNpmCommand(command, path);
    this.useBinVariable = this.useBinVariable || useBinVariable;
    return `${useBinVariable ? `$(bin)` : ''}${formatted}`;
  }
  /**
   * Add task to Makefile (appended to end)
   * @param {string} name Task name ("build", "lint", etc...)
   * @param {string[]} tasks Lines of code to be executed during task
   * @param {object} options Configure task
   * @param {string} [options.description] Task description used in help task
   * @param {boolean} [options.silent=false] Prepend "@" (true) or not (false)
   * @return {MakefileEditor} Chaining OK
   */


  addTask(name, tasks, options = {
    description: 'Task description'
  }) {
    const self = this;
    const {
      scripts
    } = self;
    const {
      description
    } = options;
    return tasks.reduce((tasks, action) => tasks.append(`\t${self.formatTask(action, scripts)}`).addTaskDescription(name, description), self.append(`${name}:`));
  }
  /**
   * Add deescription to task for use during help task
   * @param {string} task Task name
   * @param {string} description Description text
   * @example
   * const makefile = await (new MakefileEditor())
   *     .addTask('foo', 'echo foo')
   *     .commit();
   * // foo: ## Task description <-- default task description
   * //     echo foo
   * //
   * await makefile
   *     .addTaskDescription('foo', 'This task does foo')
   *     .commit();
   * // foo: ## This task does foo
   * //     echo foo
   * //
   * @return {MakefileEditor} Chaining OK
   */


  addTaskDescription(task, description = 'Task description') {
    const contents = this.contents.replace(`${(0, _kebabCase2.default)(task)}:\n`, `${(0, _kebabCase2.default)(task)}: ## ${description}\n`);
    return this.write(contents);
  }

  appendHelpTask() {
    const task = `@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##/\\n    /'`;
    return this.addTask('help', [task], {
      description: 'Show this help'
    });
  }
  /**
   * Add Makefile comment
   * @param {string} text Comment text
   * @return {MakefileEditor} Chaining OK
   */


  addComment(text) {
    return this.append(`# ${text}`);
  }

  importScripts() {
    const {
      path
    } = this;
    const [packageDirectory] = path.split('Makefile');
    const Editor = (0, _createJsonEditor.default)('package.json');
    const pkg = new Editor(packageDirectory).read();
    const {
      scripts
    } = (0, _common.parse)(pkg);
    return assign(this, {
      scripts
    });
  }
  /**
   * Append tasks imported from package.json
   * @example <caption>Must execute importScripts first</caption>
   * const makefile = await (new MakefileEditor())
   *     .importScripts()
   *     .appendScripts()
   *     .commit();
   * @return {MakefileEditor} Chaining OK
   */


  appendScripts() {
    const self = this;
    const {
      path,
      scripts
    } = self;
    const tasks = entries(scripts).map(([key, value]) => [(0, _kebabCase2.default)(key), [value]]);

    const getPreTask = (tasks, name) => {
      const [data] = tasks.filter(([name]) => name.startsWith('pre')).map(([name, values]) => [name.substring('pre'.length), values]).filter(task => task[0] === name);
      return isArray(data) ? data[1] : [];
    };

    const getPostTask = (tasks, name) => {
      const [data] = tasks.filter(([name]) => name.startsWith('post')).map(([name, values]) => [name.substring('post'.length), values]).filter(task => task[0] === name);
      return isArray(data) ? data[1] : [];
    };

    return tasks.filter(([name]) => !(name.startsWith('pre') || name.startsWith('post'))).map(([name, values]) => [name, [...getPreTask(tasks, name), ...values, ...getPostTask(tasks, name)]]).reduce((tasks, [key, values]) => tasks.addTask(key, values).append(''), self.append('')).prepend(self.useBinVariable ? `bin := ${(0, _common.getBinDirectory)(path)}` : Symbol('skip')).prepend(`# Built from ${path}/package.json`);
  }

}

exports.MakefileEditor = MakefileEditor;
var _default = MakefileEditor;
exports.default = _default;