import {join} from 'path';
import isString from 'lodash/isString';
import Queue from 'p-queue';
import memFs from 'mem-fs';
import editor from 'mem-fs-editor';

const {assign} = Object;
const silent = () => {};
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
        const copyIfExists = false;
        const targetDirectory = './';
        const fs = editor.create(memFs.create());
        const queue = new Queue({concurrency: 1});
        assign(this, {copyIfExists, fs, queue, sourceDirectory, targetDirectory});
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
     * Set overwrite flag
     * @param {boolean} flag Overwrite files (true) or not (false)
     * @returns {Scaffolder} Chaining OK
     */
    overwrite(flag) {
        return assign(this, {copyIfExists: flag});
    }
    /**
     * Copy a file
     * @param {string} path Path string of file to be copied
     * @param {string} [filename] Name for copied file
     * @returns {Scaffolder} Chaining OK
     */
    copy(path, filename) {
        const self = this;
        const {copyIfExists, fs, queue, sourceDirectory, targetDirectory} = self;
        const source = join(sourceDirectory, path);
        const target = join(process.cwd(), targetDirectory, ...(isString(filename) ? filename : path).split('/'));
        const shouldCopy = !fs.exists(target) || copyIfExists;
        shouldCopy && queue.add(() => fs.copy(source, target)).catch(silent);
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
export default Scaffolder;