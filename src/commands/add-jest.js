import {
    install,
    someDoExist,
    PackageJsonEditor
} from '../utils';

const JEST_DEPENDENCIES = [
    'jest',
    'babel-jest'
];
/** @ignore */
export const tasks = [
    {
        text: 'Add test tasks to package.json',
        task: async () => {
            const script = {
                test: 'jest .*.test.js --coverage',
                'test:watch': 'npm test -- --watchAll'
            };
            const pkg = new PackageJsonEditor();
            await pkg.extend({script}).commit();
        },
        condition: () => someDoExist('package.json')
    },
    {
        text: 'Install Jest dependencies',
        task: ({skipInstall}) => install(JEST_DEPENDENCIES, {dev: true, skipInstall}),
        condition: () => someDoExist('package.json')
    }
];
export default tasks;