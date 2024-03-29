import {bold, cyan, dim} from 'chalk';
import figures from 'figures';

export const descriptions = {
    project: `Scaffold a new Node.js project with ${bold.yellow('Babel')}, ${bold('ESLint')}, and ${bold.magenta('Jest')}`,
    app: `Scaffold a new ${bold('web application')} - basically a project with CSS, bundling, and stuff`,
    server: `Scaffold Node.js WebSocket, GraphQL, and HTTP(S) servers with an 80% solution for security "baked in"`,
    a11y: `Add automated ${bold('accessibility')} testing`,
    babel: `Use next generation JavaScript, ${bold('today!')}`,
    browsersync: `Time-saving ${bold('synchronised browser')} testing (demo your app with ${bold.yellow('live-reload')})`,
    cypress: `${bold('Test')} anything that runs in a ${bold('browser')} (including ${bold.yellow('visual regression testing')})`,
    electron: `Create a ${bold('native desktop application')} using web technologies`,
    esdoc: `Generate ${bold('documentation')} from your comments`,
    eslint: `Pluggable ${bold('linting')} utility for JavaScript and JSX`,
    jest: `Delightful JavaScript ${bold('Testing')} Framework with a focus on simplicity`,
    makefile: `Create a ${bold('Makefile')} from your package.json, like ${bold.magenta('magic!')}`,
    marionette: `${bold('Flexible Backbone framework')} with robust views and architecture solutions`,
    parcel: `${bold('Bundle')} your application (${bold.red('blazing')} fast with ${bold.white('zero configuration')})`,
    postcss: `Use ${bold('future CSS')}, never write vendor prefixes again, and much much more!`,
    react: `Build user interfaces with ${bold('components')} ${figures.arrowRight} learn once, write ${bold('anywhere')}`,
    reason: `Write functional ${bold('type safe')} code with ${bold.yellow('JavaScript')}-like syntax (works with ${bold('React')})`,
    rollup: `${bold('Bundle')} your assets (focused on ${bold('ES6')} modules and tree shaking - ${bold.white('best for libraries')})`,
    webpack: `${bold('Bundle')} your assets (with great support and a rich ecosystem)`
};
export const help = `
    ${dim.bold('Usage')}

        ${cyan('>')} tomo [commands] [terms] [options]
        
        ${cyan('>')} tomo version

        ${cyan('>')} tomo new app --use-react --use-parcel
        
        ${cyan('>')} tomo add
        
        ${cyan('>')} tomo add eslint --browser


    ${dim.bold('Commands')}

        new, add, remove, version, help


    ${dim.bold('Terms')}

        [new]
        project, app, server

        [add]
        a11y, babel, browsersync, cypress, electron, esdoc, eslint, jest,
        marionette, makefile, parcel, postcss, react, reason, rollup, webpack 

        [remove]
        a11y, browsersync, cypress, parcel, postcss, reason, rollup, webpack


    ${dim.bold('Options')}

        --assets-directory, -a  Directory for assets ${dim('[Default: ./assets]')}
        --browser, -b           Indicate tasks are intended for the browser ${dim('[Default: false]')}
        --ignore-warnings, -i   Ignore warning messages ${dim('[Default: false]')}
        --output-directory, -o  Directory for build targets ${dim('[Default: ./dist]')}
        --overwrite, -x         Copy files, even if they alrady exist ${dim('[Default: false]')}
        --port, -p              Configure port for workflow tasks that use it ${dim('[Default: 4669]')}
        --react-version         React version for ESLint configuration ${dim('[Default: "^17"]')}
        --skip-install, -s      Skip npm installations ${dim('[Default: false]')}
        --source-directory, -d  Directory for source code ${dim('[Default: ./src]')}
        --use-parcel, -P        Use Parcel instead of Webpack ${dim('[Default: false]')}
        --use-react, -r         Add React support to workflow ${dim('[Default: false]')}
        --use-rollup, -R        Use Rollup instead of Webpack ${dim('[Default: false]')}
        --use-snowpack, -S      Use Snowpack instead of Webpack ${dim('[Default: false]')}
        --version, -v           Print version
        --with-cesium, -c       Add CesiumJS to your project ${dim('[Default: false]')}
        --with-rust, -w         Add "Rust to WASM" support to your project ${dim('[Default: false]')}
        --debug, -D             Show debug data ${dim('[Default: false]')}
        --legacy-npm, -L        Do not install npm peer dependencies by default (use this option if your npm version is >=7)
`;
export const options = {
    help,
    flags: {
        version: {
            type: 'boolean',
            default: false,
            alias: 'v'
        },
        sourceDirectory: {
            type: 'string',
            default: './src',
            alias: 'd'
        },
        outputDirectory: {
            type: 'string',
            default: './dist',
            alias: 'o'
        },
        assetsDirectory: {
            type: 'string',
            default: './assets',
            alias: 'a'
        },
        useRollup: {
            type: 'boolean',
            default: false,
            alias: ['R', 'rollup']
        },
        useParcel: {
            type: 'boolean',
            default: false,
            alias: ['P', 'parcel']
        },
        useSnowpack: {
            type: 'boolean',
            default: false,
            alias: ['S', 'snowpack']
        },
        useReact: {
            type: 'boolean',
            default: false,
            alias: ['r', 'react']
        },
        reactVersion: {
            type: 'string',
            default: '^17'
        },
        withCesium: {
            type: 'boolean',
            default: false,
            alias: 'c'
        },
        withRust: {
            type: 'boolean',
            default: false,
            alias: 'w'
        },
        help: {
            type: 'boolean',
            default: false,
            alias: 'h'
        },
        ignoreWarnings: {
            type: 'boolean',
            default: false,
            alias: 'i'
        },
        skipInstall: {
            type: 'boolean',
            default: false,
            alias: 's'
        },
        browser: {
            type: 'boolean',
            default: false,
            alias: 'b'
        },
        port: {
            type: 'number',
            default: 4669,
            alias: 'p'
        },
        overwrite: {
            type: 'boolean',
            default: false,
            alias: 'x'
        },
        debug: {
            type: 'boolean',
            default: false,
            alias: 'D'
        },
        legacyNpm: {
            type: 'boolean',
            default: false,
            alias: ['L', 'legacy']
        }
    }
};