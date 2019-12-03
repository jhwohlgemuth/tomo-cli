"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports.options=exports.help=exports.descriptions=void 0;var _chalk=require("chalk"),_figures=_interopRequireDefault(require("figures"));const descriptions={project:`Scaffold a new Node.js project with ${_chalk.bold.yellow("Babel")}, ${(0,_chalk.bold)("ESLint")}, and ${_chalk.bold.magenta("Jest")}`,app:`Scaffold a new ${(0,_chalk.bold)("web application")} - basically a project with CSS, bundling, and stuff`,server:`Scaffold Node.js WebSocket, GraphQL, and HTTP(S) servers with an 80% solution for security "baked in"`,a11y:`Add automated ${(0,_chalk.bold)("accessibility")} testing`,babel:`Use next generation JavaScript, ${(0,_chalk.bold)("today!")}`,browsersync:`Time-saving ${(0,_chalk.bold)("synchronised browser")} testing (demo your app with ${_chalk.bold.yellow("live-reload")})`,cypress:`${(0,_chalk.bold)("Test")} anything that runs in a ${(0,_chalk.bold)("browser")} (including ${_chalk.bold.yellow("visual regression testing")})`,electron:`Create a ${(0,_chalk.bold)("native desktop application")} using web technologies`,esdoc:`Generate ${(0,_chalk.bold)("documentation")} from your comments`,eslint:`Pluggable ${(0,_chalk.bold)("linting")} utility for JavaScript and JSX`,jest:`Delightful JavaScript ${(0,_chalk.bold)("Testing")} Framework with a focus on simplicity`,makefile:`Create a ${(0,_chalk.bold)("Makefile")} from your package.json, like ${_chalk.bold.magenta("magic!")}`,marionette:`${(0,_chalk.bold)("Flexible Backbone framework")} with robust views and architecture solutions`,parcel:`${(0,_chalk.bold)("Bundle")} your application (${_chalk.bold.red("blazing")} fast with ${_chalk.bold.white("zero configuration")})`,postcss:`Use ${(0,_chalk.bold)("future CSS")}, never write vendor prefixes again, and much much more!`,react:`Build user interfaces with ${(0,_chalk.bold)("components")} ${_figures.default.arrowRight} learn once, write ${(0,_chalk.bold)("anywhere")}`,reason:`Write functional ${(0,_chalk.bold)("type safe")} code with ${_chalk.bold.yellow("JavaScript")}-like syntax (works with ${(0,_chalk.bold)("React")})`,rollup:`${(0,_chalk.bold)("Bundle")} your assets (focused on ${(0,_chalk.bold)("ES6")} modules and tree shaking - ${_chalk.bold.white("best for libraries")})`,webpack:`${(0,_chalk.bold)("Bundle")} your assets (with great support and a rich ecosystem)`};exports.descriptions=descriptions;const help=`
    ${_chalk.dim.bold("Usage")}

        ${(0,_chalk.cyan)(">")} tomo [commands] [terms] [options]
        
        ${(0,_chalk.cyan)(">")} tomo version

        ${(0,_chalk.cyan)(">")} tomo new app --use-react --use-parcel
        
        ${(0,_chalk.cyan)(">")} tomo add


    ${_chalk.dim.bold("Commands")}

        new, add, remove, version


    ${_chalk.dim.bold("Terms")}

        [new]
        project, app, server

        [add]
        a11y, babel, browsersync, cypress, electron, esdoc, eslint, jest,
        marionette, makefile, parcel, postcss, react, reason, rollup, webpack 

        [remove]
        a11y, browsersync, cypress, parcel, postcss, reason, rollup, webpack


    ${_chalk.dim.bold("Options")}

        --version, -v           Print version
        --source-directory, -d  Directory for source code [Default: ./src]
        --output-directory, -o  Directory for build targets [Default: ./dist]
        --assets-directory, -a  Directory for assets [Default: ./assets]
        --use-rollup,           Use Rollup instead of Webpack [Default: false]
        --use-parcel,           Use Parcel instead of Webpack [Default: false]
        --use-react, -r         Add React support to workflow [Default: false]
        --react-version         React version for ESLint configuration [Default: '16.8']
        --with-cesium           Add CesiumJS to your project [Default: false]
        --ignore-warnings, -i   Ignore warning messages [Default: false]
        --skip-install, -s      Skip npm installations [Default: false]
        --overwrite             Copy files, even if they alrady exist [Default: false]
        --browser               Indicate tasks are intended for the browser [Default: false]
        --port, -p              Configure port for workflow tasks that use it [Default: 4669]
        --debug                 Show debug data [Default: false]	
`;exports.help=help;const options={help,flags:{version:{type:"boolean",default:!1,alias:"v"},sourceDirectory:{type:"string",default:"./src",alias:"d"},outputDirectory:{type:"string",default:"./dist",alias:"o"},assetsDirectory:{type:"string",default:"./assets",alias:"a"},useRollup:{type:"boolean",default:!1,alias:"rollup"},useParcel:{type:"boolean",default:!1,alias:"parcel"},useReact:{type:"boolean",default:!1,alias:["r","react"]},reactVersion:{type:"string",default:"16.8"},withCesium:{type:"boolean",default:!1},help:{type:"boolean",default:!1,alias:"h"},ignoreWarnings:{type:"boolean",default:!1,alias:"i"},skipInstall:{type:"boolean",default:!1,alias:"s"},browser:{type:"boolean",default:!1,alias:"b"},port:{type:"number",default:4669,alias:"p"},overwrite:{type:"boolean",default:!1},debug:{type:"boolean",default:!1}}};exports.options=options;