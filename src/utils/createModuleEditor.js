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
 * @param {Object} options Options to configure module
 * @param {boolean} [options.esm=false] Select to use 'module.exports =' (false) or 'export default' (true)
 * @return {ModuleEditor} ModuleEditor class (extends {@link BasicEditor})
 */
export const createModuleEditor = (filename, contents = 'module.exports = {};', options = {esm: false}) => class ModuleEditor extends BasicEditor {
    contents = contents;
    prependedContents = '';
    created = false;
    constructor(cwd = process.cwd()) {
        super();
        const {esm} = options;
        const path = join(cwd, filename);
        assign(this, {esm, path});
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
        const {esm, fs, path, prependedContents, queue} = self;
        const exportString = esm ? 'export default ' : 'module.exports = ';
        const formatted = `${prependedContents}${exportString}${format(contents)}`.replace(/\r*\n$/g, ';');
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