import crypto from 'crypto';
import {tmpdir} from 'os';
import {join} from 'path';
import {existsSync, mkdirp, readFileSync} from 'fs-extra';
import rimraf from 'rimraf';
import dirTree from 'directory-tree';
import {omit} from 'ramda';
import Queue from 'p-queue';
import delay from 'delay';
import {format, maybeApply, populateQueue} from '../src/api';

// eslint-disable-next-line no-magic-numbers
export const testAsyncFunction = () => async ({skipInstall}) => await delay(skipInstall ? 0 : 1000 * Math.random());
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
        return (key === 'children') ? {...acc, children: val.map(remove)} : {...acc, ...omit(attrs, {[key]: val})};
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
    const {assign} = Object;
    const queue = new Queue({concurrency: tasks.length});
    const dispatch = () => {};
    const defaults = {
        assetsDirectory: './assets',
        sourceDirectory: './source',
        outputDirectory: './output',
        port: 4669
    };
    const _options = assign({}, options, defaults);
    return populateQueue({
        queue,
        dispatch,
        tasks: tasks
            .flatMap(val => maybeApply(val, _options))
            .flatMap(val => maybeApply(val, _options)),
        options: _options
    });
};
export const fileContents = path => {
    const fullpath = join(process.cwd(), path);
    return existsSync(fullpath) ? readFileSync(fullpath, 'utf8') : `No file found at ${fullpath}`;
};
export const readMakefile = makefile => {
    const [, ...rest] = makefile
        .read()
        .replace(/bin := .*\/__tests__/, 'bin := home/user/project/__tests__')
        .split('\n');
    return ['# Makefile created with tomo', ...rest].join('\n');
};
export const readMakefileContent = () => {
    const regex = /^# Built from .*\n/;
    return fileContents('./Makefile').replace(regex, '# Makefile built from /path/to/package.json');
};