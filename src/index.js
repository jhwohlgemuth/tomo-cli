#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import getStdin from 'get-stdin';
import updateNotifier from 'update-notifier';
import {showVersion} from './api';
import {descriptions, options} from './cli';
import Main from './components/main';
import commands from './commands';

// Notify updater
const pkg = require(`../package.json`);
updateNotifier({pkg}).notify();

const {input, flags} = meow(options);
(input[0] === 'version' || flags.version) && showVersion();
(async () => {
    const stdin = await getStdin();
    const done = () => typeof global._tomo_tasklist_callback === 'function' && global._tomo_tasklist_callback();
    const properties = {
        commands,
        descriptions,
        done,
        flags,
        input,
        namespace: 'tomo',
        stdin
    };
    render(<Main {...properties}/>, {exitOnCtrlC: true});
})();