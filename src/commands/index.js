/* eslint-disable no-magic-numbers */
/**
 * @file tomo commands
 * @author Jason Wohlgemuth
 * @module commands
 * @requires module:utils
 */
import delay from 'delay';
import {
    allDoNotExist,
    someDoExist
} from '../utils';
import {
    createPackageJson,
    createSourceDirectory
} from './common';
import addBabel from './add-babel';
import addJsdoc from './add-jsdoc';
import addEslint from './add-eslint';
import addJest from './add-jest';
import addPostcss from './add-postcss';

const ALWAYS = async () => true;
const testAsyncFunction = () => async ({skipInstall}) => await delay(skipInstall ? 0 : 1000 * Math.random());

const newWebapp = [
    {
        text: 'Install development dependencies',
        task: testAsyncFunction(),
        condition: ALWAYS
    },
    {
        text: 'Install production dependencies',
        task: testAsyncFunction(),
        condition: ALWAYS
    },
    {
        text: 'Scaffold webapp folder structure',
        task: testAsyncFunction(),
        condition: ALWAYS
    }
];
const addA11y = [
    {
        text: 'Add a11y tasks to package.json',
        task: testAsyncFunction(),
        condition: () => someDoExist('package.json')
    },
    {
        text: 'Install a11y dependencies',
        task: testAsyncFunction(),
        condition: ALWAYS
    }
];
const addWebpack = [
    {
        text: 'Create Webpack config file',
        task: testAsyncFunction(),
        condition: () => allDoNotExist('webpack.config.js')
    },
    {
        text: 'Install Webpack dependencies',
        task: testAsyncFunction(),
        condition: ALWAYS
    }
];
const create = {
    app: [
        ...createPackageJson,
        ...createSourceDirectory,
        ...addBabel,
        ...addEslint,
        ...addJest
    ],
    webapp: [
        ...createPackageJson,
        ...createSourceDirectory,
        ...addBabel,
        ...addEslint,
        ...addJest,
        ...newWebapp
    ],
    server: [

    ]
};
const add = {
    a11y: addA11y,
    babel: addBabel,
    docs: addJsdoc,
    eslint: [
        ...addBabel,
        ...addEslint
    ],
    jest: [
        ...addBabel,
        ...addJest
    ],
    postcss: addPostcss,
    webpack: addWebpack
};

module.exports = {
    add,
    create,
    new: create// alias for create
};