import {join} from 'path';
import {PackageJsonEditor, install} from '../../utils';
import {allDoExist} from '../../utils/common';
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
/**
 * @type {task[]}
 * @see https://marionettejs.com/
 */
export const tasks = [
    {
        text: 'Copy Marionette.js boilerplate and assets',
        task: async ({assetsDirectory, overwrite, sourceDirectory, useParcel, usePika}) => {
            const index = (useParcel || usePika) ? 'index-in-place.html' : 'index.html';
            await (new Scaffolder(join(__dirname, 'templates')))
                .overwrite(overwrite)
                .target(sourceDirectory)
                .copy('main.js')
                .target(`${sourceDirectory}/components`)
                .copy('app.js')
                .target(`${sourceDirectory}/shims`)
                .copy('mn.renderer.shim.js')
                .target(`${sourceDirectory}/plugins`)
                .copy('mn.radio.logging.js')
                .copy('mn.redux.state.js')
                .commit();
            await (new Scaffolder(join(__dirname, '..', 'common', 'templates')))
                .overwrite(overwrite)
                .target(`${assetsDirectory}`)
                .copy(index, 'index.html')
                .target(`${assetsDirectory}/css`)
                .copy('style.css')
                .target(`${assetsDirectory}/images`)
                .copy('blank_canvas.png')
                .target(`${assetsDirectory}/fonts`)
                .copy('.gitkeep')
                .target(`${assetsDirectory}/library`)
                .copy('.gitkeep')
                .target(`${assetsDirectory}/workers`)
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
        condition: () => allDoExist('package.json')
    },
    {
        text: 'Install Marionette.js dependencies',
        task: ({skipInstall}) => install(MARIONETTE_DEPENDENCIES, {skipInstall}),
        condition: ({isNotOffline}) => isNotOffline && allDoExist('package.json')
    }
];
export default tasks;