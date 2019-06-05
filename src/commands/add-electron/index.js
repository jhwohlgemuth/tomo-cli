import {join} from 'path';
import {PackageJsonEditor, install} from '../../utils';
import {allDoExist} from '../../utils/common';
import {Scaffolder} from '../../utils/Scaffolder';

const DEPENDENCIES = [
    'electron',
    'electron-context-menu',
    'electron-debug',
    'electron-is-dev'
];
const DEV_DEPENDENCIES = [
    'electron-reloader',
    'npm-run-all',
    'spectron'
];
const ALWAYS = () => true;
const sourceDirectory = join(__dirname, 'templates');
const scaffolder = new Scaffolder({sourceDirectory});
/**
 * @type {task[]}
 * @see https://electronjs.org/
 */
export const tasks = [
    {
        text: 'Copy electron application files',
        task: async () => {
            await scaffolder
                .target('.')
                .copy('index.js')
                .target('bin')
                .copy('preload.js')
                .commit();
        },
        condition: ALWAYS
    },
    {
        text: 'Configure metadata and add tasks to package.json',
        task: async ({useParcel}) => {
            const description = `Native Desktop application built with Electron`;
            const main = 'index.js';
            const name = 'tomo-native-app';
            const scripts = {
                'preelectron:start': useParcel ? 'npm run build' : 'npm-run-all build build:css',
                'electron:start': 'electron index',
                'electron:dev': 'npm run electron:start -- --enable-logging'
            };
            await (new PackageJsonEditor())
                .extend({description, main, name, scripts})
                .commit();
        },
        condition: () => allDoExist('package.json')
    },
    {
        text: 'Install electron dependencies',
        task: async ({skipInstall}) => {
            await install(DEPENDENCIES, {skipInstall});
            await install(DEV_DEPENDENCIES, {dev: true, skipInstall});
        },
        condition: () => allDoExist('package.json')
    }
];
export default tasks;