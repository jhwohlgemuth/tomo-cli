import delay from 'delay';
import {join} from 'path';
import execa from 'execa';
import {which} from 'shelljs';
import semver from 'semver';
import Queue from 'p-queue';
import prettier from 'prettier';
import {first, isNull, kebabCase, merge, negate} from 'lodash';
import {existsSync, pathExists, pathExistsSync} from 'fs-extra';
import memFs from 'mem-fs';
import editor from 'mem-fs-editor';
import {findBestMatch} from 'string-similarity';

const {assign} = Object;
const {isArray} = Array;
const INDENT_SPACES = 4;
const PRETTIER_OPTIONS = {
    bracketSpacing: false,
    parser: 'json-stringify',
    printWidth: 80,
    tabWidth: 4,
    quotes: true
};
const parse = data => JSON.parse(JSON.stringify(data));
// eslint-disable-next-line no-magic-numbers
export const testAsyncFunction = () => async ({skipInstall}) => await delay(skipInstall ? 0 : 1000 * Math.random());
export const isGlobalCommand = value => ['npm', 'echo', 'cat', 'cp', 'rm'].includes(value);
export const getCommandDirectory = command => {
    const data = which(command);
    const commandExists = negate(isNull)(data);
    return commandExists ? data.toString().split(command)[0] : '';
};
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
export const someDoExist = async (...args) => {
    const checks = await Promise.all(args.map(val => pathExists(join(process.cwd(), val))));
    return checks.some(Boolean);
};
/**
 * Check that at least one file or files exist (synchronous version of {@link someDoExist})
 * @param  {...string} args File or folder path(s)
 * @return {boolean} Some files/path do exist (true) or all do not exist (false)
 */
export const someDoExistSync = (...args) => args.map(val => pathExistsSync(join(process.cwd(), val))).some(Boolean);
/**
 * Check that all files exist
 * @param  {...string} args File of folder paths
 * @return {boolean} All files/paths exist (true) or do not (false)
 */
export const allDoExist = async (...args) => {
    const checks = await Promise.all(args.map(val => pathExists(join(process.cwd(), val))));
    return checks.every(Boolean);
};
/**
 * Check that all files exist (synchronous version of {@link allDoExist})
 * @param  {...string} args File of folder paths
 * @return {boolean} All files/paths exist (true) or do not (false)
 */
export const allDoExistSync = (...args) => args.map(val => pathExistsSync(join(process.cwd(), val))).every(Boolean);
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
export const allDoNotExist = async (...args) => {
    const checks = await Promise.all(args.map(val => pathExists(join(process.cwd(), val))));
    return checks.every(val => !val);
};
/**
 * Check that all files do not exist (synchronous version of {@link allDoNotExist})
 * @param  {...string} args File or folder path(s)
 * @return {boolean} All files/paths do not exist (true) or some do (false)
 */
export const allDoNotExistSync = (...args) => args.map(val => pathExistsSync(join(process.cwd(), val))).every(val => !val);
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
export const format = (code = {}) => prettier.format(JSON.stringify(code), PRETTIER_OPTIONS).replace(/"/g, '');
/**
 * Use string-similarity module to determine closest matching string
 * @param {Object} commands Object with commands as key values, terms as key values for each command object
 * @param {string} command Command string input
 * @param {string[]} [terms=[]] Terms input
 * @example
 * const [intendedCommand, intendedTerms] = getIntendedInput(commands, command, terms);
 * @return {string[]} [intendedCommand, intendedTerms] Array destructed assignment is recommended (see example)
 */
export const getIntendedInput = (commands, command, terms = []) => {
    const VALID_COMMANDS = Object.keys(commands);
    const {bestMatch: {target: intendedCommand}} = findBestMatch(command, VALID_COMMANDS);
    const VALID_TERMS = Object.keys(commands[intendedCommand]);
    const intendedTerms = terms.map(term => findBestMatch(term, VALID_TERMS).bestMatch.target);
    return [intendedCommand, intendedTerms];
};
/**
 * Use npm CLI to return array of module versions
 * @param {string} name npm module name
 * @example
 * const versions = getVersions('react');
 * @return {string[]} Array of versions
 */
export const getVersions = async (name = '') => (name.length === 0) ? [] : (await execa('npm', ['view', name, 'versions']))
    .stdout
    .split(',\n')
    .map(str => str.match(/\d+[.]\d+[.]\d+/))
    .map(first)
    .map(semver.valid)
    .filter(Boolean);
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
export const install = async (dependencies = [], options = {dev: false, latest: true, skipInstall: false}) => {
    const {dev, latest, skipInstall} = options;
    const identity = i => i;
    const concat = val => str => str + val;
    const args = ['install']
        .concat(dependencies.map(latest ? concat('@latest') : identity))
        .concat(dev ? '--save-dev' : []);
    skipInstall || await execa('npm', args);
    return args;
};
/**
 * Determine if system supports Rust (necessary Rust dependencies are installed)
 * @return {boolean} Are Rust components installed?
 */
export const verifyRustInstallation = () => {

};
const silent = () => { };
/**
 * Base class to serve as base for JSON and module builder classes
 */
export class BasicEditor {
    constructor() {
        const fs = editor.create(memFs.create());
        const queue = new Queue({concurrency: 1});
        assign(this, {fs, queue});
    }
    /**
     *
     * @param {string} destination Destination to copy file
     * @return {BasicEditor} Chaining OK
     */
    copy(destination) {
        const self = this;
        const {fs, path, queue} = self;
        const [filename] = path.split('/').reverse();
        queue.add(() => fs.copy(path, join(destination, filename)));
        return self;
    }
    /**
     * @return {BasicEditor} Chaining OK
     */
    delete() {
        const self = this;
        const {fs, path, queue} = self;
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
    async commit() {
        const {fs} = this;
        await new Promise(resolve => fs.commit(resolve));
        await this.done();
    }
}
/**
 * Create and edit a JSON file with a fluent API
 * @param {string} filename Name of file to edit
 * @param {object} [contents={}] Contents of file
 * @return {JsonEditor} JsonEditor class (extends {@link BasicEditor})
 */
export const createJsonEditor = (filename, contents = {}) => class JsonEditor extends BasicEditor {
    contents = contents;
    constructor(cwd = process.cwd()) {
        super();
        const path = join(cwd, filename);
        assign(this, {path});
    }
    create() {
        const self = this;
        const {contents, fs, path, queue} = self;
        existsSync(path) || queue.add(() => fs.writeJSON(path, contents, null, INDENT_SPACES));
        return self;
    }
    read() {
        const {fs, path} = this;
        return fs.readJSON(path) || '';
    }
    extend(contents) {
        const self = this;
        const {fs, path, queue} = self;
        queue.add(() => fs.extendJSON(path, contents, null, INDENT_SPACES));
        return self;
    }
    /**
     * Check if package.json manifest file has dependencies (dependencies or devDependencies)
     * @param  {...string} modules npm module names
     * @return {Boolean} Has at least one dependency (true) or none (false)
     */
    hasSome(...modules) {
        const {keys} = Object;
        const pkg = this.read();
        const {dependencies, devDependencies} = parse(pkg);
        const installed = [...keys(dependencies ? dependencies : {}), ...keys(devDependencies ? devDependencies : {})];
        return modules.some(module => installed.includes(module));
    }
    /**
     * Check if package.json manifest file has dependencies (dependencies or devDependencies)
     * @param  {...string} modules npm module names
     * @return {Boolean} Has all dependencies (true) or not all (false)
     */
    hasAll(...modules) {
        const {keys} = Object;
        const pkg = this.read();
        const {dependencies, devDependencies} = parse(pkg);
        const installed = [...keys(dependencies ? dependencies : {}), ...keys(devDependencies ? devDependencies : {})];
        return modules.every(module => installed.includes(module));
    }
};
/**
 * Create and edit a JS module with a fluent API
 * @param {string} filename Name of file to edit
 * @param {string} [contents='module.exports = {};'] Contents of file
 * @param {string} [prependedContents=''] Content prepended to top of file
 * @return {ModuleEditor} ModuleEditor class (extends {@link BasicEditor})
 */
export const createModuleEditor = (filename, contents = 'module.exports = {};', prependedContents = '') => class ModuleEditor extends BasicEditor {
    contents = contents;
    prependedContents = prependedContents;
    created = false;
    constructor(cwd = process.cwd()) {
        super();
        const path = join(cwd, filename);
        assign(this, {path});
    }
    create() {
        const self = this;
        const {contents, path} = self;
        self.created || (existsSync(path) || self.write(contents));
        return self;
    }
    read() {
        const {fs, path} = this;
        return fs.exists(path) ? fs.read(path) : '';
    }
    write(contents) {
        const self = this;
        const {fs, path, prependedContents, queue} = self;
        const formatted = `${prependedContents}module.exports = ${format(contents)}`.replace(/\r*\n$/g, ';');
        queue
            .add(() => fs.write(path, formatted))
            .then(() => self.created = existsSync(path))
            .catch(silent);
        return assign(self, {contents});
    }
    extend(code) {
        this.contents = merge(contents, code);
        this.write(this.contents);
        return this;
    }
    prepend(code) {
        const self = this;
        const {contents, prependedContents} = self;
        self.prependedContents = `${code}\n${prependedContents}`.replace(/\n*$/, '\n\n');
        return self.write(contents);
    }
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
export class Scaffolder {
    /**
     *
     * @param {Object} options Scaffolding options
     * @param {string} options.sourceDirectory Source directory for template files
     */
    constructor(options = {sourceDirectory: join(__dirname, 'templates')}) {
        const {sourceDirectory} = options;
        const targetDirectory = './';
        const fs = editor.create(memFs.create());
        const queue = new Queue({concurrency: 1});
        assign(this, {fs, queue, sourceDirectory, targetDirectory});
    }
    /**
     * Set source directory
     * @param {string} sourceDirectory Source directory of template files
     * @returns {Scaffolder} Chaining OK
     */
    source(sourceDirectory) {
        return assign(this, {sourceDirectory});
    }
    /**
     * Set target directory
     * @param {string} targetDirectory Target directory of template files
     * @returns {Scaffolder} Chaining OK
     */
    target(targetDirectory) {
        return assign(this, {targetDirectory});
    }
    /**
     * Copy a file
     * @param {string} path Path string of file to be copied
     * @returns {Scaffolder} Chaining OK
     */
    copy(path) {
        const self = this;
        const {fs, queue, sourceDirectory, targetDirectory} = self;
        const source = join(sourceDirectory, path);
        const target = join(process.cwd(), targetDirectory, ...path.split('/'));
        queue.add(() => fs.copy(source, target)).catch(silent);
        return self;
    }
    /**
     * Write changes to disk
     * @return {Promise} Resolves when queue is empty
     */
    async commit() {
        const {fs, queue} = this;
        await new Promise(resolve => fs.commit(resolve));
        await queue.onEmpty();
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
export const BabelConfigModuleEditor = createModuleEditor('babel.config.js', {
    plugins: [
        `'@babel/plugin-transform-runtime'`,
        `'@babel/plugin-proposal-class-properties'`,
        `'@babel/plugin-proposal-export-default-from'`,
        `'@babel/plugin-proposal-optional-chaining'`
    ],
    presets: [`'@babel/preset-env'`]
});
/**
 * Create and edit an ESLint configuration file with a fluent API
 * @type {ModuleEditor}
 * @example
 * const cfg = new EslintConfigModuleEditor();
 * await cfg.create().commit();
 */
export const EslintConfigModuleEditor = createModuleEditor('.eslintrc.js', {
    env: {
        es6: true,
        jest: true
    },
    extends: [
        `'omaha-prime-grade'`
    ],
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
export const PackageJsonEditor = createJsonEditor('package.json', {
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
export const PostcssConfigEditor = createModuleEditor('postcss.config.js', {
    parser: `require('postcss-safe-parser')`,
    processors: [
        `require('stylelint')()`,
        `require('postcss-import')()`,
        `require('postcss-cssnext')()`,
        `require('uncss').postcssPlugin({html: ['index.html']})`,
        `require('cssnano')()`,
        `require('postcss-reporter')({clearReportedMessages: true})`
    ]
});
/**
 * Create and edit a Webpack configuration file with a fluent API
 * @type {ModuleEditor}
 * @example
 * const cfg = new WebpackConfigEditor();
 * await cfg.create().commit();
 */
export const WebpackConfigEditor = createModuleEditor('webpack.config.js', {
    mode: `'development'`,
    entry: {
        app: `'./src/main.js'`
    },
    output: {
        path: `resolve('./dist')`,
        filename: `'bundle.min.js'`
    },
    module: {
        rules: [
            {
                test: `/\.js?$/`,
                exclude: `/node_modules/`,
                loader: `'babel-loader'`,
                query: {
                    presets: [`'@babel/env'`]
                }
            }
        ]
    },
    plugins: [
        `new DashboardPlugin()`
    ]
});
/**
 * Create and edit Makefiles. Includes ability to import package.json scripts.
 */
export class MakefileEditor extends createModuleEditor('Makefile') {
    scripts = {};
    constructor(path = process.cwd()) {
        super(path);
        this.contents = `# Built from ${path}/package.json`;
    }
    write(contents) {
        const self = this;
        const {fs, path, queue} = self;
        queue
            .add(() => fs.write(path, contents))
            .then(() => self.created = existsSync(path))
            .catch(silent);
        return assign(self, {contents});
    }
    append(lines = '') {
        const {contents} = this;
        return this.write(`${contents}\n${lines}`);
    }
    addTask(name, ...tasks) {
        const self = this;
        return tasks.reduce((tasks, task) => tasks.append(`\t${task}`), self.append(`${name}:`));
    }
    appendHelpTask() {
        return this;
    }
    addComment(text) {
        return this.append(`# ${text}`);
    }
    importScripts() {
        const {path} = this;
        const [packageDirectory] = path.split('Makefile');
        const pkg = (new PackageJsonEditor(packageDirectory)).read();
        const {scripts} = parse(pkg);
        return assign(this, {scripts});
    }
    appendScripts() {
        const self = this;
        const {path, scripts} = self;
        const getBinDirectory = path => {
            const [packageDirectory] = path.split('Makefile');
            return `${packageDirectory}node_modules/.bin/`;
        };
        const isLocalNpmCommand = (command, path = process.cwd()) => {
            const [packageDirectory] = path.split('Makefile');
            const pkg = new PackageJsonEditor(packageDirectory);
            const pkgHasCommmand = pkg.hasAll(command);
            const binHasCommand = existsSync(`${getBinDirectory(path)}${command}`);
            return pkgHasCommmand || binHasCommand;
        };
        const formatTask = value => {
            const [command] = value.split(' ');
            return `@${isLocalNpmCommand(command, path) ? `$(bin)` : ''}${value}`;
        };
        const tasks = Object.entries(scripts).map(([key, value]) => [kebabCase(key), [value].map(formatTask)]);
        const getPreTask = (tasks, name) => {
            const [data] = tasks
                .filter(([name]) => name.startsWith('pre'))
                .map(([name, values]) => [name.substring('pre'.length), values])
                .filter(task => task[0] === name);
            return isArray(data) ? data[1] : [];
        };
        const getPostTask = (tasks, name) => {
            const [data] = tasks
                .filter(([name]) => name.startsWith('post'))
                .map(([name, values]) => [name.substring('post'.length), values])
                .filter(task => task[0] === name);
            return isArray(data) ? data[1] : [];
        };
        const usesBinVariable = tasks
            .map(([, values]) => values)
            .map(values => values.some(name => /\$\(bin\)/.test(name)))
            .some(Boolean);
        usesBinVariable && self.append(`bin := ${getBinDirectory(path)}`);
        return tasks
            .filter(([name]) => !(name.startsWith('pre') || name.startsWith('post')))
            .map(([name, values]) => [name, [...getPreTask(tasks, name), ...values, ...getPostTask(tasks, name)]])
            .reduce((tasks, [key, values]) => tasks.addTask(key, ...values).append(''), self.append(''));
    }
}