/* eslint-disable no-magic-numbers */
import {
    createPackageJson,
    createSourceDirectory
} from './common';
import addA11y from './add-a11y';
import addBabel from './add-babel';
import addEsdoc from './add-esdoc';
import addEslint from './add-eslint';
import addJest from './add-jest';
import addMarionette from './add-marionette';
import addPostcss from './add-postcss';
import addWebpack from './add-webpack';

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
        ...addMarionette
    ],
    server: [
        ...createProject
    ]
};
const add = {
    a11y: addA11y,
    babel: addBabel,
    docs: addEsdoc,
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