import {PackageJsonEditor, install} from '../utils';
import {someDoExist} from '../utils/common';

const JEST_DEPENDENCIES = [
    'jest',
    'babel-jest'
];
/**
 * @type {task[]}
 * @see https://jestjs.io/
 */
export const addJest = [
    {
        text: 'Add test tasks to package.json',
        task: async () => {
            const scripts = {
                test: 'jest .*.test.js --coverage',
                'test:watch': 'npm test -- --watchAll'
            };
            const pkg = new PackageJsonEditor();
            await pkg.extend({scripts}).commit();
        },
        condition: () => someDoExist('package.json')
    },
    {
        text: 'Install Jest dependencies',
        task: ({skipInstall}) => install(JEST_DEPENDENCIES, {dev: true, skipInstall}),
        condition: () => someDoExist('package.json')
    }
];
export default addJest;