import {join} from 'path';
import {PackageJsonEditor, install} from '../../utils';
import {someDoExist} from '../../utils/common';
import {Scaffolder} from '../../utils/Scaffolder';

const MARIONETTE_DEPENDENCIES = [
    'jquery',
    'backbone',
    'backbone.marionette',
    'backbone.radio',
    'marionette.approuter',
    'morphdom',
    'lodash-es',
    'redux'
];
const ALWAYS = async () => true;
const sourceDirectory = join(__dirname, 'templates');
const scaffolder = new Scaffolder({sourceDirectory});
/**
 * @type {task[]}
 * @see https://marionettejs.com/
 */
export const tasks = [
    {
        text: 'Add Marionette.js boilerplate and assets',
        task: async ({sourceDirectory}) => {
            await scaffolder
                .target(sourceDirectory)
                .copy('main.js')
                .target(`${sourceDirectory}/components`)
                .copy('app.js')
                .target(`${sourceDirectory}/shims`)
                .copy('mn.renderer.shim.js')
                .target(`${sourceDirectory}/plugins`)
                .copy('mn.radio.logging.js')
                .copy('mn.redux.state.js')
                .target('assets')
                .copy('index.html')
                .target('assets/css')
                .copy('style.css')
                .target('assets/templates')
                .copy('example.hbs')
                .target('assets/images')
                .copy('.gitkeep')
                .target('assets/fonts')
                .copy('.gitkeep')
                .target('assets/library')
                .copy('.gitkeep')
                .target('assets/workers')
                .copy('.gitkeep')
                .commit();
        },
        condition: ALWAYS
    },
    {
        text: 'Set package.json "main" attribute',
        task: async ({sourceDirectory}) => {
            const main = `${sourceDirectory}/main.js`;
            await (new PackageJsonEditor())
                .extend({main})
                .commit();
        },
        condition: () => someDoExist('package.json')
    },
    {
        text: 'Install Marionette.js dependencies',
        task: ({skipInstall}) => install(MARIONETTE_DEPENDENCIES, {skipInstall}),
        condition: ({isNotOffline}) => isNotOffline && someDoExist('package.json')
    }
];
export default tasks;