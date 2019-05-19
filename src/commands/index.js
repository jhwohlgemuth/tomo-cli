/* eslint-disable no-magic-numbers */
import {
    addDevTasks,
    createPackageJson,
    createSourceDirectory
} from './common';
import addA11y from './add-a11y';
import addBabel from './add-babel';
import addEsdoc from './add-esdoc';
import addEslint from './add-eslint';
import addJest from './add-jest';
import addMakefile from './add-makefile';
import addMarionette from './add-marionette';
import {addPostcss, removePostcss} from './add-postcss';
import {addWebpack, removeWebpack} from './add-webpack';

const createProject = [
    ...createPackageJson,
    ...createSourceDirectory,
    ...addBabel,
    ...addEslint,
    ...addJest
];
const create = {
    project: createProject,
    app: [
        ...createProject,
        ...addMarionette,
        ...addWebpack,
        ...addPostcss,
        ...addDevTasks
    ],
    server: [
        ...createProject
    ]
};
const add = {
    a11y: addA11y,
    babel: addBabel,
    esdoc: addEsdoc,
    eslint: [
        ...addBabel,
        ...addEslint
    ],
    jest: [
        ...addBabel,
        ...addJest
    ],
    makefile: addMakefile,
    postcss: addPostcss,
    webpack: [
        ...addBabel,
        ...addWebpack
    ]
};
const remove = {
    postcss: removePostcss,
    webpack: removeWebpack
};

export default {
    add,
    remove,
    create,
    new: create// alias for create
};
/**
 * @typedef {Object} task
 * @property {string} text Display text for task
 * @property {function} task Task to execute
 * @property {function} condition Predicate to decide when to execute the task (true) or not (false)
 * @property {function} [optional] Predicate to decide when to show the task (true) or not (false)
 */