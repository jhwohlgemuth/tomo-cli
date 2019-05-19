import {mkdirp} from 'fs-extra';
import {PackageJsonEditor} from '../utils';
import {allDoNotExist, allDoExist} from '../utils/common';

/** @ignore */
export const createPackageJson = [
    {
        text: 'Create package.json',
        task: async () => {
            await (new PackageJsonEditor())
                .create()
                .commit();
        },
        condition: () => allDoNotExist('package.json')
    }
];
/** @ignore */
export const createSourceDirectory = [
    {
        text: 'Create source directory',
        task: ({sourceDirectory}) => mkdirp(sourceDirectory),
        condition: ({sourceDirectory}) => allDoNotExist(sourceDirectory)
    }
];
/** @ignore */
export const addDevTasks = [
    {
        text: 'Add development tasks to package.json',
        task: async () => {
            const scripts = {
                dev: 'npm-run-all --parallel build:watch build:css:watch',
                start: 'echo under construction'
            };
            await (new PackageJsonEditor())
                .extend({scripts})
                .commit();
        },
        condition: () => allDoExist('package.json', 'webpack.config.js', 'postcss.config.js')
    }
];