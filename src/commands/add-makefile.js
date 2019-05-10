import {
    allDoNotExist,
    allDoExist,
    allDoExistSync
} from '../utils/common';
import MakefileEditor from '../utils/MakefileEditor';
/**
 * @type {task[]}
 * @see https://www.gnu.org/software/make/manual/html_node/Simple-Makefile.html#Simple-Makefile
 */
export const addMakefile = [
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
export default addMakefile;