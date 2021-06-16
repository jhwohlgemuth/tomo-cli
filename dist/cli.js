"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports.options=exports.help=exports.descriptions=void 0;var _chalk=require("chalk"),_figures=_interopRequireDefault(require("figures"));const descriptions={project:`Scaffold a new Node.js project with ${_chalk.bold.yellow("Babel")}, ${(0,_chalk.bold)("ESLint")}, and ${_chalk.bold.magenta("Jest")}`,app:`Scaffold a new ${(0,_chalk.bold)("web application")} - basically a project with CSS, bundling, and stuff`,server:`Scaffold Node.js WebSocket, GraphQL, and HTTP(S) servers with an 80% solution for security "baked in"`,a11y:`Add automated ${(0,_chalk.bold)("accessibility")} testing`,babel:`Use next generation JavaScript, ${(0,_chalk.bold)("today!")}`,browsersync:`Time-saving ${(0,_chalk.bold)("synchronised browser")} testing (demo your app with ${_chalk.bold.yellow("live-reload")})`,cypress:`${(0,_chalk.bold)("Test")} anything that runs in a ${(0,_chalk.bold)("browser")} (including ${_chalk.bold.yellow("visual regression testing")})`,electron:`Create a ${(0,_chalk.bold)("native desktop application")} using web technologies`,esdoc:`Generate ${(0,_chalk.bold)("documentation")} from your comments`,eslint:`Pluggable ${(0,_chalk.bold)("linting")} utility for JavaScript and JSX`,jest:`Delightful JavaScript ${(0,_chalk.bold)("Testing")} Framework with a focus on simplicity`,makefile:`Create a ${(0,_chalk.bold)("Makefile")} from your package.json, like ${_chalk.bold.magenta("magic!")}`,marionette:`${(0,_chalk.bold)("Flexible Backbone framework")} with robust views and architecture solutions`,parcel:`${(0,_chalk.bold)("Bundle")} your application (${_chalk.bold.red("blazing")} fast with ${_chalk.bold.white("zero configuration")})`,postcss:`Use ${(0,_chalk.bold)("future CSS")}, never write vendor prefixes again, and much much more!`,react:`Build user interfaces with ${(0,_chalk.bold)("components")} ${_figures.default.arrowRight} learn once, write ${(0,_chalk.bold)("anywhere")}`,reason:`Write functional ${(0,_chalk.bold)("type safe")} code with ${_chalk.bold.yellow("JavaScript")}-like syntax (works with ${(0,_chalk.bold)("React")})`,rollup:`${(0,_chalk.bold)("Bundle")} your assets (focused on ${(0,_chalk.bold)("ES6")} modules and tree shaking - ${_chalk.bold.white("best for libraries")})`,webpack:`${(0,_chalk.bold)("Bundle")} your assets (with great support and a rich ecosystem)`};exports.descriptions=descriptions;const help=`
    ${_chalk.dim.bold("Usage")}

        ${(0,_chalk.cyan)(">")} tomo [commands] [terms] [options]
        
        ${(0,_chalk.cyan)(">")} tomo version

        ${(0,_chalk.cyan)(">")} tomo new app --use-react --use-parcel
        
        ${(0,_chalk.cyan)(">")} tomo add
        
        ${(0,_chalk.cyan)(">")} tomo add eslint --browser


    ${_chalk.dim.bold("Commands")}

        new, add, remove, version, help


    ${_chalk.dim.bold("Terms")}

        [new]
        project, app, server

        [add]
        a11y, babel, browsersync, cypress, electron, esdoc, eslint, jest,
        marionette, makefile, parcel, postcss, react, reason, rollup, webpack 

        [remove]
        a11y, browsersync, cypress, parcel, postcss, reason, rollup, webpack


    ${_chalk.dim.bold("Options")}

        --assets-directory, -a  Directory for assets ${(0,_chalk.dim)("[Default: ./assets]")}
        --browser               Indicate tasks are intended for the browser ${(0,_chalk.dim)("[Default: false]")}
        --debug                 Show debug data ${(0,_chalk.dim)("[Default: false]")}	
        --ignore-warnings, -i   Ignore warning messages ${(0,_chalk.dim)("[Default: false]")}
        --output-directory, -o  Directory for build targets ${(0,_chalk.dim)("[Default: ./dist]")}
        --overwrite             Copy files, even if they alrady exist ${(0,_chalk.dim)("[Default: false]")}
        --port, -p              Configure port for workflow tasks that use it ${(0,_chalk.dim)("[Default: 4669]")}
        --react-version         React version for ESLint configuration ${(0,_chalk.dim)("[Default: \"^16\"]")}
        --skip-install, -s      Skip npm installations ${(0,_chalk.dim)("[Default: false]")}
        --source-directory, -d  Directory for source code ${(0,_chalk.dim)("[Default: ./src]")}
        --use-parcel,           Use Parcel instead of Webpack ${(0,_chalk.dim)("[Default: false]")}
        --use-react, -r         Add React support to workflow ${(0,_chalk.dim)("[Default: false]")}
        --use-rollup,           Use Rollup instead of Webpack ${(0,_chalk.dim)("[Default: false]")}
        --use-snowpack,         Use Snowpack instead of Webpack ${(0,_chalk.dim)("[Default: false]")}
        --version, -v           Print version
        --with-cesium           Add CesiumJS to your project ${(0,_chalk.dim)("[Default: false]")}
        --with-rust             Add "Rust to WASM" support to your project ${(0,_chalk.dim)("[Default: false]")}
`;exports.help=help;const options={help,flags:{version:{type:"boolean",default:!1,alias:"v"},sourceDirectory:{type:"string",default:"./src",alias:"d"},outputDirectory:{type:"string",default:"./dist",alias:"o"},assetsDirectory:{type:"string",default:"./assets",alias:"a"},useRollup:{type:"boolean",default:!1,alias:"rollup"},useParcel:{type:"boolean",default:!1,alias:"parcel"},useSnowpack:{type:"boolean",default:!1,alias:"snowpack"},useReact:{type:"boolean",default:!1,alias:["r","react"]},reactVersion:{type:"string",default:"^17"},withCesium:{type:"boolean",default:!1},withRust:{type:"boolean",default:!1},help:{type:"boolean",default:!1,alias:"h"},ignoreWarnings:{type:"boolean",default:!1,alias:"i"},skipInstall:{type:"boolean",default:!1,alias:"s"},browser:{type:"boolean",default:!1,alias:"b"},port:{type:"number",default:4669,alias:"p"},overwrite:{type:"boolean",default:!1},debug:{type:"boolean",default:!1}}};exports.options=options;