import {mkdirp} from 'fs-extra';
import {
    allDoNotExist,
    PackageJsonEditor
} from '../utils';

/**
 * @ignore
 */
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
/**
 * @ignore
 */
export const createSourceDirectory = [
    {
        text: 'Create source directory',
        task: ({sourceDirectory}) => mkdirp(sourceDirectory),
        condition: ({sourceDirectory}) => allDoNotExist(sourceDirectory)
    }
];