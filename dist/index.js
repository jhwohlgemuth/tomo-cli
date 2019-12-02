#!/usr/bin/env node
"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault"),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_react=_interopRequireDefault(require("react")),_chalk=require("chalk"),_ink=require("ink"),_meow=_interopRequireDefault(require("meow")),_getStdin=_interopRequireDefault(require("get-stdin")),_updateNotifier=_interopRequireDefault(require("update-notifier")),_api=require("./api"),_main=_interopRequireDefault(require("./main"));// Notify updater
const pkg=require(`../package.json`);(0,_updateNotifier.default)({pkg}).notify();const help=`
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
`,options={help,flags:{version:{type:"boolean",default:!1,alias:"v"},sourceDirectory:{type:"string",default:"./src",alias:"d"},outputDirectory:{type:"string",default:"./dist",alias:"o"},assetsDirectory:{type:"string",default:"./assets",alias:"a"},useRollup:{type:"boolean",default:!1,alias:"rollup"},useParcel:{type:"boolean",default:!1,alias:"parcel"},useReact:{type:"boolean",default:!1,alias:["r","react"]},reactVersion:{type:"string",default:"16.8"},withCesium:{type:"boolean",default:!1},help:{type:"boolean",default:!1,alias:"h"},ignoreWarnings:{type:"boolean",default:!1,alias:"i"},skipInstall:{type:"boolean",default:!1,alias:"s"},browser:{type:"boolean",default:!1,alias:"b"},port:{type:"number",default:4669,alias:"p"},overwrite:{type:"boolean",default:!1},debug:{type:"boolean",default:!1}}},{input,flags}=(0,_meow.default)(options);("version"===input[0]||flags.version)&&(0,_api.showVersion)(),(0,_asyncToGenerator2.default)(function*(){const a=yield(0,_getStdin.default)();(0,_ink.render)(_react.default.createElement(_main.default,{input:input,flags:flags,stdin:a}),{exitOnCtrlC:!0})})();