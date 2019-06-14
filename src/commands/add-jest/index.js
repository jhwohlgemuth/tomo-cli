import {join} from 'path';
import {PackageJsonEditor, install} from '../../utils';
import {someDoExist} from '../../utils/common';
import {Scaffolder} from '../../utils/Scaffolder';

const ALWAYS = () => true;
const JEST_DEPENDENCIES = [
    'jest',
    'jest-watch-typeahead',
    'babel-jest'
];
/**
 * @type {task[]}
 * @see https://jestjs.io/
 */
export const addJest = [
    {
        text: 'Add test tasks and Jest configuration to package.json',
        task: async ({browser}) => {
            const scripts = {
                test: 'jest .*.test.js --coverage',
                'test:ing': 'npm test -- --watchAll'
            };
            const jest = {
                testMatch: ['**/__tests__/**/*.(e2e|test).[jt]s?(x)'],
                setupFilesAfterEnv: browser ? ['<rootDir>/__tests__/setup.js'] : undefined,
                watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname']
            };
            await (new PackageJsonEditor())
                .extend({jest, scripts})
                .commit();
        },
        condition: () => someDoExist('package.json')
    },
    {
        text: 'Copy Jest boilerplate',
        task: async ({browser}) => {
            const scaffolder = new Scaffolder(join(__dirname, 'templates'));
            browser && await scaffolder
                .target('__tests__')
                .copy('setup.js');
            await scaffolder
                .target('__tests__')
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