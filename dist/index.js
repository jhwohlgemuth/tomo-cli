#!/usr/bin/env node
"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault"),_react=_interopRequireDefault(require("react")),_chalk=require("chalk"),_ink=require("ink"),_meow=_interopRequireDefault(require("meow")),_ui=_interopRequireDefault(require("./ui"));// import updateNotifier from 'update-notifier';
// Notify updater
// const pkg = require(`../package.json`);
// updateNotifier({pkg}).notify();
const help=`
	${_chalk.gray.bold("Usage")}
		$ ${(0,_chalk.cyan)("tomo [command] [term] [options]")}

	${_chalk.gray.bold("Options")}

        --source-directory, -d  Directory for source code [Default: ./src]
        --assets-directory,     Directory for assets [Default: ./assets]
        --use-react, -r         Add React support to workflow [Default: false]
        --react-version         React version for ESLint configuration [Default: '16.8']
		--ignore-warnings, -i   Ignore warning messages [Default: false]
        --skip-install, -s      Skip npm installations [Default: false]
        --debug                 Show debug data [Default: false]

	${_chalk.gray.bold("Examples")}

		$ tomo
		    ${(0,_chalk.dim)("I love Ink")}
		$ tomo --name=ponies
		    ${(0,_chalk.dim)("I love ponies")}	
`,options={help,flags:{sourceDirectory:{type:"string",default:"./src",alias:"d"},assetsDirectory:{type:"string",default:"./assets"},useReact:{type:"boolean",default:!1,alias:"r"},reactVersion:{type:"string",default:"16.8"},ignoreWarnings:{type:"boolean",default:!1,alias:"i"},skipInstall:{type:"boolean",default:!1,alias:"s"},debug:{type:"boolean",default:!1}}},cli=(0,_meow.default)(options),{input,flags}=cli;(0,_ink.render)(_react.default.createElement(_ui.default,{input:input,flags:flags}),{exitOnCtrlC:!0});