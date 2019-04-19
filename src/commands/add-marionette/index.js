import {join} from 'path';
import {
    install,
    Scaffolder,
    someDoExist
} from '../../utils';

const MARIONETTE_DEPENDENCIES = [
    'backbone',
    'backbone.marionette',
    'backbone.radio',
    'handlebars',
    'lodash',
    'redux'
];
const ALWAYS = async () => true;
const sourceDirectory = join(__dirname, 'templates');
const scaffolder = new Scaffolder({sourceDirectory});
/** @ignore */
export const tasks = [
    {
        text: 'Add Marionette.js Webapp boilerplate',
        task: async ({sourceDirectory}) => {
            await scaffolder
                .target(sourceDirectory)
                .copy('index.html')
                .copy('main.js')
                .copy('app.js')
                .target(`${sourceDirectory}/plugins`)
                .copy('mn.radio.logging.js')
                .copy('mn.redux.state.js')
                .target(`${sourceDirectory}/shims`)
                .copy('mn.renderer.shim.js')
                .commit();
        },
        condition: ALWAYS
    },
    {
        text: 'Add webapp CSS assets',
        task: async () => {
            await scaffolder
                .target('assets/css')
                .copy('style.css')
                .commit();
        },
        condition: ALWAYS
    },
    {
        text: 'Add webapp template assets',
        task: async ({sourceDirectory}) => {
            await scaffolder
                .target(`${sourceDirectory}/shims`)
                .copy('mn.templates.shim.js')
                .target('assets/templates')
                .copy('example.hbs')
                .commit();
        },
        condition: ALWAYS
    },
    {
        text: 'Install Marionette.js dependencies',
        task: ({skipInstall}) => install(MARIONETTE_DEPENDENCIES, {skipInstall}),
        condition: () => someDoExist('package.json')
    }
];
export default tasks;