/**
 * @file Utility functions for tomo
 * @author Jason Wohlgemuth
 * @module utils
 */
import {join} from 'path';
import execa from 'execa';
import Queue from 'p-queue';
import prettier from 'prettier';
import {first, merge, noop} from 'lodash';
import {existsSync, pathExists} from 'fs-extra';
import memFs from 'mem-fs';
import editor from 'mem-fs-editor';
import {findBestMatch} from 'string-similarity';

const {assign} = Object;
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
const someDoExist = async (...args) => {
    const checks = await Promise.all(args.map(val => pathExists(join(process.cwd(), val))));
    return checks.some(Boolean);
};
/**
 * @async
 * @function allDoNotExist
 * @param  {...string} args File or folder path(s)
 * @return {boolean} All files/paths do not exist (true) or some do (false)
 */
const allDoNotExist = async (...args) => {
    const checks = await Promise.all(args.map(val => pathExists(join(process.cwd(), val))));
    return checks.every(val => !val);
};
/**
 * @function format
 * @description Format input code using Prettier
 * @param {*} code Code to be formatted
 * @return {string} Code formatted by Prettier
 */
const format = code => prettier.format(JSON.stringify(code), PRETTIER_OPTIONS).replace(/"/g, '');
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
    const {bestMatch: {target: intendedCommand}} = findBestMatch(command, VALID_COMMANDS);
    const VALID_TERMS = Object.keys(commands[intendedCommand]);
    const intendedTerms = terms.map(term => findBestMatch(term, VALID_TERMS).bestMatch.target);
    return [intendedCommand, intendedTerms];
};
/**
 * @async
 * @function getVersions
 * @description Use npm CLI to return array of module versions
 * @param {string} name npm module name
 * @return {string[]} Array of versions
 */
const getVersions = async (name = '') => (name.length === 0) ? [] : (await execa('npm', ['view', name, 'versions']))
    .stdout
    .split(',\n')
    .map(str => str.match(/\d+[.]\d+[.]\d+/))
    .map(first);
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
const install = async (dependencies = [], options = {dev: false, latest: true, skipInstall: false}) => {
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
 * @function verifyRustInstallation
 * @return {boolean} Are Rust components installed?
 */
const verifyRustInstallation = () => {

};
/**
 * @function createJsonEditor
 * @param {string} filename Name of file to edit
 * @param {object} [contents={}] Contents of file
 * @return {JsonEditor} JsonEditor class
 */
const createJsonEditor = (filename, contents = {}) => class JsonEditor {
    contents = contents;
    constructor(cwd = process.cwd()) {
        this.fs = editor.create(memFs.create());
        this.path = join(cwd, filename);
    }
    create(shouldCommit = true, commitCallback = noop) {
        const {fs, path, contents} = this;
        if (!existsSync(path)) {
            fs.writeJSON(path, contents, null, INDENT_SPACES);
            shouldCommit && fs.commit(commitCallback);
        }
        return this;
    }
    read() {
        return this.fs.readJSON(this.path) || '';
    }
    extend(contents, shouldCommit = true, commitCallback = noop) {
        const {fs, path} = this;
        fs.extendJSON(path, contents, null, INDENT_SPACES);
        shouldCommit && fs.commit(commitCallback);
        return this;
    }
    copy(destination, shouldCommit = true, commitCallback = noop) {
        const {fs, path} = this;
        fs.copy(path, join(destination, filename));
        shouldCommit && fs.commit(commitCallback);
        return this;
    }
    delete(shouldCommit = true, commitCallback = noop) {
        const {fs, path} = this;
        fs.delete(path);
        shouldCommit && fs.commit(commitCallback);
        return this;
    }
};
/**
 * @function createModuleEditor
 * @param {string} filename Name of file to edit
 * @param {string} [contents='module.exports = {};'] Contents of file
 * @param {string} [prependedContents=''] Content prepended to top of file
 * @return {ModuleEditor} ModuleEditor class
 */
const createModuleEditor = (filename, contents = 'module.exports = {};', prependedContents = '') => class ModuleEditor {
    contents = contents;
    prependedContents = prependedContents;
    created = false;
    constructor(cwd = process.cwd()) {
        this.fs = editor.create(memFs.create());
        this.path = join(cwd, filename);
    }
    write(content, shouldCommit = true, commitCallback = noop) {
        const {fs, path, prependedContents} = this;
        const formatted = `${prependedContents}module.exports = ${format(content)}`.replace(/\r*\n$/g, ';');
        fs.write(path, formatted);
        shouldCommit && fs.commit(commitCallback);
    }
    create(...args) {
        const self = this;
        const {contents, path} = self;
        self.created || (existsSync(path) || self.write(contents, ...args));
        self.created = existsSync(path);
        return self;
    }
    read() {
        const {fs, path} = this;
        return fs.exists(path) ? fs.read(path) : '';
    }
    extend(code, shouldCommit = true, commitCallback = noop) {
        this.contents = merge(contents, code);
        this.write(this.contents, shouldCommit, commitCallback);
        return this;
    }
    prepend(code, shouldCommit = true, commitCallback = noop) {
        const self = this;
        const {contents, fs, prependedContents} = self;
        self.prependedContents = `${code}\n${prependedContents}`.replace(/\n*$/, '\n\n');
        self.write(contents, shouldCommit);
        shouldCommit && fs.commit(commitCallback);
        return self;
    }
    delete(shouldCommit = true, commitCallback = noop) {
        const {fs, path} = this;
        fs.delete(path);
        shouldCommit && fs.commit(commitCallback);
        return this;
    }
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
    constructor(options = {sourceDirectory: join(__dirname, 'templates')}) {
        const {sourceDirectory} = options;
        const targetDirectory = './';
        const fs = editor.create(memFs.create());
        const queue = new Queue({concurrency: 1});
        assign(this, {fs, queue, sourceDirectory, targetDirectory});
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
        const {fs, queue, sourceDirectory, targetDirectory} = self;
        const source = join(sourceDirectory, path);
        const target = join(process.cwd(), targetDirectory, ...path.split('/'));
        queue.add(() => fs.copy(source, target));
        return self;
    }
    async commit() {
        const {fs, queue} = this;
        await new Promise(resolve => fs.commit(resolve));
        await queue.onEmpty();
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
    plugins: [
        `'@babel/plugin-transform-runtime'`,
        `'@babel/plugin-proposal-class-properties'`,
        `'@babel/plugin-proposal-export-default-from'`,
        `'@babel/plugin-proposal-optional-chaining'`
    ],
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
    extends: [
        `'omaha-prime-grade'`
    ],
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
    processors: [
        `require('stylelint')()`,
        `require('postcss-import')()`,
        `require('postcss-cssnext')()`,
        `require('uncss').postcssPlugin({html: ['index.html']})`,
        `require('cssnano')()`,
        `require('postcss-reporter')({clearReportedMessages: true})`
    ]
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