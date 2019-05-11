#!/usr/bin/env node
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _chalk = require("chalk");

var _ink = require("ink");

var _meow = _interopRequireDefault(require("meow"));

var _ui = _interopRequireDefault(require("./ui"));

// import updateNotifier from 'update-notifier';
// Notify updater
// const pkg = require(`../package.json`);
// updateNotifier({pkg}).notify();
const help = `
	${_chalk.gray.bold('Usage')}
		$ ${(0, _chalk.cyan)('tomo [command] [term] [options]')}

	${_chalk.gray.bold('Options')}

        --source-directory, -d  Directory for source code [Default: ./src]
        --assets-directory,     Directory for assets [Default: ./assets]
        --use-react, -r         Add React support to workflow [Default: false]
        --react-version         React version for ESLint configuration [Default: '16.8']
		--ignore-warnings, -i   Ignore warning messages [Default: false]
		--skip-install, -s      Skip npm installations [Default: false]

	${_chalk.gray.bold('Examples')}

		$ tomo
		    ${(0, _chalk.dim)('I love Ink')}
		$ tomo --name=ponies
		    ${(0, _chalk.dim)('I love ponies')}	
`;
const options = {
  help,
  flags: {
    sourceDirectory: {
      type: 'string',
      default: './src',
      alias: 'd'
    },
    assetsDirectory: {
      type: 'string',
      default: './assets'
    },
    useReact: {
      type: 'boolean',
      default: false,
      alias: 'r'
    },
    reactVersion: {
      type: 'string',
      default: '16.8'
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
    }
  }
};
const cli = (0, _meow.default)(options);
const {
  input,
  flags
} = cli;
(0, _ink.render)(_react.default.createElement(_ui.default, {
  input: input,
  flags: flags
}), {
  exitOnCtrlC: true
});