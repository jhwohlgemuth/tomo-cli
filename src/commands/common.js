import {mkdirp} from 'fs-extra';
import {
    allDoNotExist,
    PackageJsonEditor
} from '../utils';

export const createPackageJson = [
    {
        text: 'Create package.json',
        task: () => {
            const pkg = new PackageJsonEditor();
            pkg.create();
        },
        condition: () => allDoNotExist('package.json')
    }
];
export const createSourceDirectory = [
    {
        text: 'Create source directory',
        task: ({sourceDirectory}) => mkdirp(sourceDirectory),
        condition: ({sourceDirectory}) => allDoNotExist(sourceDirectory)
    }
];