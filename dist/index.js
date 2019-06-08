#!/usr/bin/env node
"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault"),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_react=_interopRequireDefault(require("react")),_chalk=require("chalk"),_ink=require("ink"),_meow=_interopRequireDefault(require("meow")),_getStdin=_interopRequireDefault(require("get-stdin")),_ui=_interopRequireDefault(require("./ui"));// import updateNotifier from 'update-notifier';
// Notify updater
// const pkg = require(`../package.json`);
// updateNotifier({pkg}).notify();
const help=`
	${_chalk.dim.bold("Usage")}
		$ ${(0,_chalk.cyan)("tomo [command] [term] [options]")}

	${_chalk.dim.bold("Options")}

        --source-directory, -d  Directory for source code [Default: ./src]
        --output-directory, -o  Directory for build targets [Default: ./dist]
        --assets-directory, -a  Directory for assets [Default: ./assets]
        --use-rollup,           Use Rollup instead of Webpack [Default: false]
        --use-parcel,           Use Parcel instead of Webpack [Default: false]
        --use-react, -r         Add React support to workflow [Default: false]
        --react-version         React version for ESLint configuration [Default: '16.8']
        --ignore-warnings, -i   Ignore warning messages [Default: false]
        --skip-install, -s      Skip npm installations [Default: false]
        --overwrite             Copy files, even if they alrady exist [Default: false]
        --browser               Indicate tasks are intended for the browser [Default: false]
        --debug                 Show debug data [Default: false]	
`,options={help,flags:{sourceDirectory:{type:"string",default:"./src",alias:"d"},outputDirectory:{type:"string",default:"./dist",alias:"o"},assetsDirectory:{type:"string",default:"./assets",alias:"a"},useRollup:{type:"boolean",default:!1},useParcel:{type:"boolean",default:!1},useReact:{type:"boolean",default:!1,alias:"r"},reactVersion:{type:"string",default:"16.8"},ignoreWarnings:{type:"boolean",default:!1,alias:"i"},skipInstall:{type:"boolean",default:!1,alias:"s"},browser:{type:"boolean",default:!1},overwrite:{type:"boolean",default:!1},debug:{type:"boolean",default:!1}}},cli=(0,_meow.default)(options),{input,flags}=cli;(0,_asyncToGenerator2.default)(function*(){const a=yield(0,_getStdin.default)();(0,_ink.render)(_react.default.createElement(_ui.default,{input:input,flags:flags,stdin:a}),{exitOnCtrlC:!0})})();