import {join} from 'path';
import {existsSync} from 'fs-extra';
import BasicEditor from './BasicEditor';
import {parse} from './common';

const {assign} = Object;
const INDENT_SPACES = 4;
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
export default createJsonEditor;