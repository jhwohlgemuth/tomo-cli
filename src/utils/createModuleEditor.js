import {join} from 'path';
import {existsSync} from 'fs-extra';
import merge from 'lodash/merge';
import {format} from './common';
import BasicEditor from './BasicEditor';

const {assign} = Object;
const silent = () => { };
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
export default createModuleEditor;