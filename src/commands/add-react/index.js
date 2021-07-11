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
            const format = filename => {
                const [name, extension] = filename.split('.');
                const type = useSnowpack ? 'snowpack' : (useParcel ? 'parcel' : 'default');
                const dict = {
                    snowpack: {
                        main: `main-snowpack.${extension}`,
                        app: `App-snowpack.${extension}`,
                        body: `Body-snowpack.${extension}`,
                        header: `Header-snowpack.${extension}`,
                        footer: `Footer-snowpack.${extension}`,
                        index: `index-in-place-react-snowpack.${extension}`,
                        style: `style-snowpack.${extension}`,
                        fonts: 'fonts-in-place.css'
                    },
                    parcel: {
                        main: `main-parcel.${extension}`,
                        app: `App-parcel.${extension}`,
                        body: `Body.${extension}`,
                        header: `Header.${extension}`,
                        footer: `Footer.${extension}`,
                        index: `index-in-place-react.html`,
                        style: `style.${extension}`,
                        fonts: 'fonts-in-place.css'
                    },
                    default: {
                        main: `main.${extension}`,
                        app: `App.${extension}`,
                        body: `Body.${extension}`,
                        header: `Header.${extension}`,
                        footer: `Footer.${extension}`,
                        index: `index-react.html`,
                        style: `style.${extension}`,
                        fonts: 'fonts.css'
                    }
                };
                return dict[type][name.toLowerCase()];
            };
            await (new Scaffolder(join(__dirname, 'templates')))
                .overwrite(overwrite)
                .target(sourceDirectory)
                .copy(format('main.js'), `main.js${useSnowpack ? '' : 'x'}`)
                .target(`${sourceDirectory}/components`)
                .copy(format('App.js'), 'App.jsx')
                .copy(format('Header.js'), 'Header.jsx')
                .copy(format('Body.js'), 'Body.jsx')
                .copy(format('Footer.js'), 'Footer.jsx')
                .commit();
            await (new Scaffolder(join(__dirname, '..', 'common', 'templates')))
                .overwrite(overwrite)
                .target('.')
                .copy('gitignore', '.gitignore')
                .target(`${assetsDirectory}`)
                .copy(format('index.html'), 'index.html')
                .target(`${assetsDirectory}/css`)
                .copy(format('style.css'), 'style.css')
                .copy(format('fonts.css'), 'fonts.css')
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
        task: async ({legacyNpm, reactVersion, skipInstall, useSnowpack}) => {
            const dependencies = [
                'prop-types',
                `react@${reactVersion}`,
                `react-dom@${reactVersion}`,
                'wouter', // https://github.com/molefrog/wouter
                ...(useSnowpack ? [] : ['@hot-loader/react-dom'])
            ];
            await install(dependencies, {latest: false, legacy: legacyNpm, skipInstall});
            await install(DEV_DEPENDENCIES, {dev: true, skipInstall});
        },
        condition: ({skipInstall}) => !skipInstall && allDoExist('package.json')
    }
];
export default addReact;
