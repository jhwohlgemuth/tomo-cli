import {join} from 'path';
import Queue from 'p-queue';
import memFs from 'mem-fs';
import editor from 'mem-fs-editor';

const {assign} = Object;
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
export default BasicEditor;