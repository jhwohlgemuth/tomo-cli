#!/usr/bin/env node

import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import {cyan, dim, gray} from 'chalk';
import Tomo from './ui';
// import updateNotifier from 'update-notifier';
// Notify updater
// const pkg = require(`../package.json`);
// updateNotifier({pkg}).notify();

const help = `
	${gray.bold('Usage')}
		$ ${cyan('tomo [command] [term] [options]')}

	${gray.bold('Options')}

        --source-directory, -d  Directory for source code [Default: ./src]
        --assets-directory,     Directory for assets [Default: ./assets]
        --use-react, -r         Add React support to workflow [Default: false]
        --react-version         React version for ESLint configuration [Default: '16.8']
		--ignore-warnings, -i   Ignore warning messages [Default: false]
		--skip-install, -s      Skip npm installations [Default: false]

	${gray.bold('Examples')}

		$ tomo
		    ${dim('I love Ink')}
		$ tomo --name=ponies
		    ${dim('I love ponies')}	
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
const cli = meow(options);

const {input, flags} = cli;
render(<Tomo input={input} flags={flags}/>, {exitOnCtrlC: true});