import {join} from 'path';
import {is} from 'ramda';
import {pathExists, pathExistsSync} from 'fs-extra';
import prettier from 'prettier';

const PRETTIER_OPTIONS = {
    bracketSpacing: false,
    parser: 'json-stringify',
    printWidth: 150,
    tabWidth: 4,
    singleQuote: true
};
const newMap = val => new Map(val);
const joinPath = name => join(process.cwd(), name);
const checkPathExists = name => name |> joinPath |> pathExists;
const checkPathExistsSync = name => name |> joinPath |> pathExistsSync;
export const dict = val => val |> Object.entries |> newMap;
export const isEmptyString = data => typeof data === 'string' && data.length === 0;
export const parse = data => data |> JSON.stringify |> JSON.parse;
export const maybeApply = (val, options) => is(Function)(val) ? val(options) : val;
export const getBinDirectory = path => {
    const [packageDirectory] = path.split('Makefile');
    return `${packageDirectory}node_modules/.bin/`;
};
/**
 * Format input code using Prettier
 * @param {*} [code=''] Code to be formatted
 * @example <caption>Prettier options</caption>
 * {
 *     bracketSpacing: false,
 *     parser: 'json-stringify',
 *     printWidth: 150,
 *     tabWidth: 4,
 *     singleQuote: true
 * }
 * @return {string} Code formatted by Prettier
 */
export const format = (code = {}) => prettier
    .format(JSON.stringify(code), PRETTIER_OPTIONS)
    .replace(/"/g, '');
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
    const checks = await Promise.all(args.map(checkPathExists));
    return checks.some(Boolean);
};
/**
 * Check that at least one file or files exist (synchronous version of {@link someDoExist})
 * @param  {...string} args File or folder path(s)
 * @return {boolean} Some files/path do exist (true) or all do not exist (false)
 */
export const someDoExistSync = (...args) => args.map(checkPathExistsSync).some(Boolean);
/**
 * Check that all files exist
 * @param  {...string} args File of folder paths
 * @return {boolean} All files/paths exist (true) or do not (false)
 */
export const allDoExist = async (...args) => {
    const checks = await Promise.all(args.map(checkPathExists));
    return checks.every(Boolean);
};
/**
 * Check that all files exist (synchronous version of {@link allDoExist})
 * @param  {...string} args File of folder paths
 * @return {boolean} All files/paths exist (true) or do not (false)
 */
export const allDoExistSync = (...args) => args.map(checkPathExistsSync).every(Boolean);
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
    const checks = await Promise.all(args.map(checkPathExists));
    return checks.every(val => !val);
};
/**
 * Check that all files do not exist (synchronous version of {@link allDoNotExist})
 * @param  {...string} args File or folder path(s)
 * @return {boolean} All files/paths do not exist (true) or some do (false)
 */
export const allDoNotExistSync = (...args) => args.map(checkPathExistsSync).every(val => !val);