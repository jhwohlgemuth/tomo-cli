import {join} from 'path';
import {PackageJsonEditor, install} from '../../utils';
import {someDoExist} from '../../utils/common';
import {Scaffolder} from '../../utils/Scaffolder';

const ALWAYS = () => true;
const JEST_DEPENDENCIES = [
    'jest',
    'babel-jest'
];
const sourceDirectory = join(__dirname, 'templates');
const scaffolder = new Scaffolder({sourceDirectory});
/**
 * @type {task[]}
 * @see https://jestjs.io/
 */
export const addJest = [
    {
        text: 'Add test tasks and Jest configuration to package.json',
        task: async () => {
            const scripts = {
                test: 'jest .*.test.js --coverage',
                'test:watch': 'npm test -- --watchAll'
            };
            const jest = {
                testMatch: ['**/__tests__/**/*.(e2e|test).[jt]s?(x)'],
                setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js']
            };
            await (new PackageJsonEditor())
                .extend({jest, scripts})
                .commit();
        },
        condition: () => someDoExist('package.json')
    },
    {
        text: 'Copy Jest boilerplate',
        task: async () => {
            await scaffolder
                .target('__tests__')
                .copy('setup.js')
                .copy('example.test.js')
                .commit();
        },
        condition: ALWAYS
    },
    {
        text: 'Install Jest dependencies',
        task: ({skipInstall}) => install(JEST_DEPENDENCIES, {dev: true, skipInstall}),
        condition: ({isNotOffline}) => isNotOffline && someDoExist('package.json')
    }
];
export default addJest;