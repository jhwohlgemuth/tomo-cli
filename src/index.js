#!/usr/bin/env node
import {join} from 'path';
import React from 'react';
import {cyan, dim} from 'chalk';
import {render} from 'ink';
import meow from 'meow';
import read from 'read-pkg';
import getStdin from 'get-stdin';
import Tomo from './ui';
// import updateNotifier from 'update-notifier';
// Notify updater
// const pkg = require(`../package.json`);
// updateNotifier({pkg}).notify();

const showVersion = () => {
    const cwd = join(__dirname, '..');
    const {version} = read.sync({cwd});
    console.log(version); // eslint-disable-line no-console
    process.exit();
};
const help = `
    ${dim.bold('Usage')}

        ${cyan('>')} tomo version

        ${cyan('>')} tomo [command] [terms] [options]

    ${dim.bold('Options')}

        --version,          -v  Print version
        --source-directory, -d  Directory for source code [Default: ./src]
        --output-directory, -o  Directory for build targets [Default: ./dist]
        --assets-directory, -a  Directory for assets [Default: ./assets]
        --use-rollup,           Use Rollup instead of Webpack [Default: false]
        --use-parcel,           Use Parcel instead of Webpack [Default: false]
        --use-react,        -r  Add React support to workflow [Default: false]
        --react-version         React version for ESLint configuration [Default: '16.8']
        --ignore-warnings,  -i  Ignore warning messages [Default: false]
        --skip-install,     -s  Skip npm installations [Default: false]
        --overwrite             Copy files, even if they alrady exist [Default: false]
        --browser               Indicate tasks are intended for the browser [Default: false]
        --port              -p  Configure port for workflow tasks that use it [Default: 4669]
        --debug                 Show debug data [Default: false]	
`;
const options = {
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
            alias: 'rollup'
        },
        useParcel: {
            type: 'boolean',
            default: false,
            alias: 'parcel'
        },
        useReact: {
            type: 'boolean',
            default: false,
            alias: ['r', 'react']
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
            default: false
        },
        debug: {
            type: 'boolean',
            default: false
        }
    }
};
const {input, flags} = meow(options);
(input[0] === 'version' || flags.version) && showVersion();
(async () => {
    const stdin = await getStdin();
    render(<Tomo input={input} flags={flags} stdin={stdin}/>, {exitOnCtrlC: true});
})();