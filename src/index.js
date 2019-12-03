#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import getStdin from 'get-stdin';
import updateNotifier from 'update-notifier';
import {showVersion} from './api';
import {descriptions, options} from './cli';
import UI from './main';

// Notify updater
const pkg = require(`../package.json`);
updateNotifier({pkg}).notify();

const {input, flags} = meow(options);
(input[0] === 'version' || flags.version) && showVersion();
(async () => {
    const stdin = await getStdin();
    render(<UI descriptions={descriptions} input={input} flags={flags} stdin={stdin}/>, {exitOnCtrlC: true});
})();