#!/usr/bin/env node
import React, {Fragment} from 'react';
import {render} from 'ink';
import meow from 'meow';
import getStdin from 'get-stdin';
import updateNotifier from 'update-notifier';
import {showVersion} from './api';
import {descriptions, options} from './cli';
import UI from './main';
import commands from './commands';

// Notify updater
const pkg = require(`../package.json`);
updateNotifier({pkg}).notify();

const {input, flags} = meow(options);
(input[0] === 'version' || flags.version) && showVersion();
(async () => {
    const stdin = await getStdin();
    const done = () => typeof global._tomo_tasklist_callback === 'function' && global._tomo_tasklist_callback();
    const Main = () => <Fragment>
        <UI
            commands={commands}
            descriptions={descriptions}
            done={done}
            flags={flags}
            input={input}
            namespace={'tomo'}
            stdin={stdin}/>
    </Fragment>;
    render(<Main/>, {exitOnCtrlC: true});
})();