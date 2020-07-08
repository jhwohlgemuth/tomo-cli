import {join} from 'path';
import {
    PackageJsonEditor,
    Scaffolder,
    allDoExist,
    install
} from '../../api';

const MARIONETTE_DEPENDENCIES = [
    'jquery',
    'backbone',
    'backbone.marionette',
    'backbone.radio',
    'marionette.approuter',
    'lit-html',
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
        task: async ({assetsDirectory, overwrite, sourceDirectory, useParcel, useSnowpack}) => {
            const inPlace = (useParcel || useSnowpack) ? '-in-place' : '';
            const index = `index${inPlace}.html`;
            const fonts = `fonts${inPlace}.css`;
            await (new Scaffolder(join(__dirname, 'templates')))
                .overwrite(overwrite)
                .target(sourceDirectory)
                .copy('main.js')
                .target(`${sourceDirectory}/components`)
                .copy('app.js')
                .copy('header.js')
                .copy(useSnowpack ? 'body-snowpack.js' : 'body.js', 'body.js')
                .copy('footer.js')
                .target(`${sourceDirectory}/shims`)
                .copy('mn.renderer.shim.js')
                .target(`${sourceDirectory}/plugins`)
                .copy('mn.radio.logging.js')
                .copy('mn.redux.state.js')
                .commit();
            await (new Scaffolder(join(__dirname, '..', 'common', 'templates')))
                .overwrite(overwrite)
                .target('.')
                .copy('gitignore', '.gitignore')
                .target(`${assetsDirectory}`)
                .copy(index, 'index.html')
                .target(`${assetsDirectory}/css`)
                .copy(`style${useSnowpack ? '-snowpack' : ''}.css`, 'style.css')
                .copy(fonts, 'fonts.css')
                .target(`${assetsDirectory}/images`)
                .copy('blank_canvas.png')
                .copy('preferences.png')
                .target(`${assetsDirectory}/fonts`)
                .copy('SansForgetica-Regular.eot')
                .copy('SansForgetica-Regular.svg')
                .copy('SansForgetica-Regular.ttf')
                .copy('SansForgetica-Regular.woff')
                .copy('SansForgetica-Regular.woff2')
                .target(`${assetsDirectory}/library`)
                .copy('.gitkeep')
                .target(`${assetsDirectory}/workers`)
                .copy('.gitkeep')
                .commit();
        },
        condition: ALWAYS
    },
    {
        text: 'Copy Rust boilerplate',
        task: async ({overwrite}) => {
            await (new Scaffolder(join(__dirname, '..', 'common', 'templates')))
                .overwrite(overwrite)
                .target('.')
                .copy('Cargo.toml')
                .target('rust-to-wasm')
                .copy('Cargo_crate.toml', 'Cargo.toml')
                .target('rust-to-wasm/src')
                .copy('lib.rs')
                .copy('utils.rs')
                .target('rust-to-wasm/tests')
                .copy('app.rs')
                .copy('web.rs')
                .commit();
        },
        condition: ({withRust}) => withRust,
        optional: ({withRust}) => withRust
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
        condition: ({skipInstall}) => !skipInstall && allDoExist('package.json')
    }
];
export default tasks;