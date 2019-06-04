/* eslint-disable no-magic-numbers */
import {choose, withOptions} from '../utils';
import {
    createPackageJson,
    createSourceDirectory
} from './common';
import addA11y from './add-a11y';
import addBabel from './add-babel';
import {addBrowsersync} from './add-browsersync';
import addEsdoc from './add-esdoc';
import addEslint from './add-eslint';
import addJest from './add-jest';
import addMakefile from './add-makefile';
import addMarionette from './add-marionette';
import {addParcel, removeParcel} from './add-parcel';
import {addPostcss, removePostcss} from './add-postcss';
import {addRollup, removeRollup} from './add-rollup';
import {addWebpack, removeWebpack} from './add-webpack';
import createServer from './create-server';

const createProject = [
    ...createPackageJson,
    ...createSourceDirectory,
    ...addBabel,
    ...addEslint
];
const create = {
    project: createProject,
    app: [
        ...createProject,
        ...addPostcss,
        ...addJest,
        choose({
            default: addMarionette,
            useReact: []// do nothing
        }),
        choose({
            default: addWebpack,
            useRollup: addRollup,
            useParcel: addParcel
        }),
        choose({
            default: addBrowsersync,
            useParcel: []// do nothing
        })
    ],
    server: [
        withOptions({sourceDirectory: '.'}),
        ...createPackageJson,
        ...addEslint,
        ...createServer
    ]
};
const add = {
    a11y: addA11y,
    babel: addBabel,
    browsersync: addBrowsersync,
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
    parcel: [
        ...addBabel,
        ...addParcel
    ],
    postcss: addPostcss,
    rollup: [
        ...addBabel,
        ...addRollup
    ],
    webpack: [
        ...addBabel,
        ...addWebpack
    ]
};
const remove = {
    parcel: removeParcel,
    postcss: removePostcss,
    rollup: removeRollup,
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
 * @property {function} condition Predicate to decide when to execute the task (true) or not (false) - can be async or sync
 * @property {function} [optional] Predicate to decide when to show the task (true) or not (false) - MUST be sync
 */