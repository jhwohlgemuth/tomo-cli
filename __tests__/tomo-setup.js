/* eslint-disable no-console */
const crypto = require('crypto');
const {tmpdir} = require('os');
const {join} = require('path');
const {mkdirp} = require('fs-extra');
const rimraf = require('rimraf');
const dirTree = require('directory-tree');
const execa = require('execa');
const omit = require('lodash/omit');

const createTemporaryDirectory = async () => {
    const tempDir = join(tmpdir(), `tomo-test-${crypto.randomBytes(20).toString('hex')}`);// eslint-disable-line no-magic-numbers
    await mkdirp(tempDir);
    return tempDir;
};
const useTemporaryDirectory = () => {
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
const removeAttributes = (obj, ...attrs) => {
    const result = Object.entries(obj).reduce((acc, arr) => {
        const [key, val] = arr;
        const remove = val => removeAttributes(val, ...attrs);
        return (key === 'children') ? {...acc, children: val.map(remove)} : {...acc, ...omit({[key]: val}, attrs)};
    }, {});
    return result;
};
const getDirectoryTree = (directory, options = {omit: ['extension', 'path']}) => {
    const {omit} = options;
    const tree = dirTree(directory);
    const result = Object.assign(tree, {name: tree.name.substring(0, 'tomo-test'.length)});
    return removeAttributes(result, ...omit);
};

const [setTempDir, cleanupTempDir] = useTemporaryDirectory();

(async () => {
    const tempDirectory = await setTempDir();
    console.log(tempDirectory);
    console.log(__dirname);
    const cwd = tempDirectory;
    const {stdout} = execa.sync('tomo', ['new', 'app'], {cwd});
    const tree = getDirectoryTree(tempDirectory);
    // await cleanupTempDir();
    console.log(stdout);
    console.log(tree)
})();
