import {
    allDoNotExist,
    allDoExist,
    allDoExistSync
} from '../utils/common';
import MakefileEditor from '../utils/MakefileEditor';

/** @ignore */
export const tasks = [
    {
        text: 'Create Makefile',
        task: async () => {
            await (new MakefileEditor())
                .create()
                .write('# Makefile built with tomo')
                .commit();
        },
        condition: () => allDoNotExist('Makefile')
    },
    {
        text: 'Import tasks from package.json scripts',
        task: async () => {
            await (new MakefileEditor())
                .delete()
                .create()
                .importScripts()
                .appendScripts()
                .appendHelpTask()
                .commit();
        },
        condition: () => allDoExist('Makefile', 'package.json'),
        optional: () => allDoExistSync('Makefile', 'package.json')
    }
];
export default tasks;