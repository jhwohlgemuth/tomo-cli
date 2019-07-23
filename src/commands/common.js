import {join} from 'path';
import {mkdirp} from 'fs-extra';
import {PackageJsonEditor} from '../utils';
import {allDoNotExist} from '../utils/common';
import {Scaffolder} from '../utils/Scaffolder';

/** @ignore */
export const createEditorConfiguration = [
    {
        text: 'Create editor configuration file',
        task: async ({overwrite}) => {
            await (new Scaffolder(join(__dirname, 'common', 'templates')))
                .overwrite(overwrite)
                .target('.')
                .copy('.editorconfig', '.editorconfig')
                .commit();
        },
        condition: () => allDoNotExist('.editorconfig')
    }
];
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