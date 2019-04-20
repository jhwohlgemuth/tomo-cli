import crypto from 'crypto';
import {tmpdir} from 'os';
import {join} from 'path';
import {mkdirp} from 'fs-extra';
import rimraf from 'rimraf';
import dirTree from 'directory-tree';
import {omit} from 'lodash';
import Queue from 'p-queue';
import {populateQueue} from '../src/ui';
import {format} from '../src/utils';

const createTemporaryDirectory = async () => {
    const tempDir = join(tmpdir(), `tomo-test-${crypto.randomBytes(20).toString('hex')}`);// eslint-disable-line no-magic-numbers
    await mkdirp(tempDir);
    return tempDir;
};
export const useTemporaryDirectory = () => {
    let tempDir;
    const setTempDirectory = async () => {
        tempDir = await createTemporaryDirectory();
        return tempDir;
    };
    const cleanupTempDirectory = async () => {
        await new Promise(resolve => rimraf(tempDir, resolve));
    };
    return [setTempDirectory, cleanupTempDirectory];
};
export const removeAttributes = (obj, ...attrs) => {
    const result = Object.entries(obj).reduce((acc, arr) => {
        const [key, val] = arr;
        const remove = val => removeAttributes(val, ...attrs);
        return (key === 'children') ? {...acc, children: val.map(remove)} : {...acc, ...omit({[key]: val}, attrs)};
    }, {});
    return result;
};
export const getDirectoryTree = (directory, options = {omit: ['extension', 'path']}) => {
    const {omit} = options;
    const tree = dirTree(directory);
    const result = Object.assign(tree, {name: tree.name.substring(0, 'tomo-test'.length)});
    return format(removeAttributes(result, ...omit));
};
export const run = (tasks, options) => {
    const queue = new Queue({concurrency: tasks.length});
    const dispatch = () => {};
    return populateQueue({queue, dispatch, tasks, options});
};