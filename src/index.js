#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import getStdin from 'get-stdin';
import updateNotifier from 'update-notifier';
import {Main, showVersion} from './api';
import {descriptions, options} from './cli';
import commands from './commands';

// Notify updater
const pkg = require(`../package.json`);
updateNotifier({pkg}).notify();

const {input, flags} = meow(options);
(input[0] === 'version' || flags.version) && showVersion();
(async () => {
    const stdin = await getStdin();
    const properties = {commands, descriptions, flags, input, stdin};
    render(<Main namespace="tomo" {...properties}/>, {exitOnCtrlC: true});
})();