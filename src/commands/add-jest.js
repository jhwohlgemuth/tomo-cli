import {
    install,
    someDoExist,
    PackageJsonEditor
} from '../utils';

const pkg = new PackageJsonEditor();

const JEST_DEPENDENCIES = [
    'jest',
    'babel-jest'
];
export default [
    {
        text: 'Add test tasks to package.json',
        task: async () => {
            await pkg.extend({
                script: {
                    test: 'jest .*.test.js --coverage',
                    'test:watch': 'npm test -- --watchAll'
                }
            }).commit();
        },
        condition: () => someDoExist('package.json')
    },
    {
        text: 'Install Jest dependencies',
        task: ({skipInstall}) => install(JEST_DEPENDENCIES, {dev: true, skipInstall}),
        condition: () => someDoExist('package.json')
    }
];