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
/**
 * @type {task[]}
 * @see https://electronjs.org/
 */
export const tasks = [
    {
        text: 'Copy electron application files',
        task: async () => {
            await (new Scaffolder(join(__dirname, 'templates')))
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
                'build:electron': 'npm-run-all build:es build:css',
                'prestart:electron': 'npm run build:electron',
                'start:electron': 'electron index --enable-logging',
                dev: `npm-run-all --parallel watch:es${useParcel ? '' : ' watch:css'} start:electron`
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