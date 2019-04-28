import {mkdirp} from 'fs-extra';
import {PackageJsonEditor} from '../utils';
import {allDoNotExist} from '../utils/common';

/** @ignore */
export const createPackageJson = [
    {
        text: 'Create package.json',
        task: async () => {
            const pkg = new PackageJsonEditor();
            await pkg.create().commit();
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