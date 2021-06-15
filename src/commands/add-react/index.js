import {join} from 'path';
import {
    PackageJsonEditor,
    Scaffolder,
    allDoExist,
    install
} from '../../api';

const DEV_DEPENDENCIES = [
    'npm-run-all'
];
const ALWAYS = () => true;
/**
 * @type {task[]}
 * @see https://reactjs.org/
 */
export const addReact = [
    {
        text: 'Copy React boilerplate and assets',
        task: async ({assetsDirectory, sourceDirectory, overwrite, useParcel, useSnowpack}) => {
            const inPlace = (useParcel || useSnowpack) ? '-in-place' : '';
            const index = `index${inPlace}-react${useSnowpack ? '-snowpack' : ''}.html`;
            const fonts = `fonts${inPlace}.css`;
            const format = filename => {
                const [name, extension] = filename.split('.');
                return `${name}${useSnowpack ? '-snowpack' : ''}.${extension}`;
            };
            await (new Scaffolder(join(__dirname, 'templates')))
                .overwrite(overwrite)
                .target(sourceDirectory)
                .copy(format('main.js'), `main.js${useSnowpack ? '' : 'x'}`)
                .target(`${sourceDirectory}/components`)
                .copy(format('App.js'), 'App.jsx')
                .copy('Header.js', 'Header.jsx')
                .copy(format('Body.js'), 'Body.jsx')
                .copy('Footer.js', 'Footer.jsx')
                .commit();
            await (new Scaffolder(join(__dirname, '..', 'common', 'templates')))
                .overwrite(overwrite)
                .target('.')
                .copy('gitignore', '.gitignore')
                .target(`${assetsDirectory}`)
                .copy(index, 'index.html')
                .target(`${assetsDirectory}/css`)
                .copy(format('style.css'), 'style.css')
                .copy(fonts, 'fonts.css')
                .target(`${assetsDirectory}/images`)
                .copy('react.png')
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
        text: 'Set package.json "main" attribute and add scripts tasks',
        task: async ({sourceDirectory, useParcel, useRollup, useSnowpack}) => {
            const main = `${sourceDirectory}/main.js`;
            const watches = {
                'watch:es': useRollup ? `watch \"npm run build:es\" ${sourceDirectory}` : 'webpack serve --hot --open --mode development'
            };
            const scripts = {
                ...(useSnowpack ? {} : watches),
                start: useSnowpack ? 'snowpack dev' : 'npm-run-all build:es --parallel watch:*'
            };
            await (new PackageJsonEditor())
                .extend({main})
                .extend(useParcel ? {} : {scripts})
                .commit();
        },
        condition: () => allDoExist('package.json')
    },
    {
        text: 'Install React dependencies',
        task: async ({reactVersion, skipInstall, useSnowpack}) => {
            const dependencies = [
                'prop-types',
                `react@${reactVersion}`,
                `react-dom@${reactVersion}`,
                'wouter', // https://github.com/molefrog/wouter
                ...(useSnowpack ? [] : ['@hot-loader/react-dom'])
            ];
            await install(dependencies, {latest: false, skipInstall});
            await install(DEV_DEPENDENCIES, {dev: true, skipInstall});
        },
        condition: ({skipInstall}) => !skipInstall && allDoExist('package.json')
    }
];
export default addReact;
