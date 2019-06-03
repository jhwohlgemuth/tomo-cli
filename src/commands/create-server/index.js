import {join} from 'path';
import {PackageJsonEditor, install} from '../../utils';
import {allDoExist} from '../../utils/common';
import {Scaffolder} from '../../utils/Scaffolder';

const DEPENDENCIES = [
    'apollo-server-express',
    'compression',
    'config',
    'cookie-session',
    'dotenv',
    'ejs',
    'express',
    'express-session',
    'fs-extra',
    'graphql',
    'helmet',
    'lusca',
    'remarkable',
    'highlight.js',
    'node-uuid',
    'npmlog',
    'protocolify',
    'ws'
];
const DEV_DEPENDENCIES = [
    'nodemon',
    'open-cli',
    'stmux'
];
const ALWAYS = () => true;
const sourceDirectory = join(__dirname, 'templates');
const scaffolder = new Scaffolder({sourceDirectory});
/**
 * @type {task[]}
 * @see https://expressjs.com/
 * @see https://github.com/websockets/ws
 * @see https://www.apollographql.com/docs/apollo-server/
 */
export const tasks = [
    {
        text: 'Copy server files',
        task: async () => {
            await scaffolder
                .target('./')
                .copy('.env')
                .copy('favicon.ico')
                .copy('_gitignore', '.gitignore')
                .copy('index.js')
                .copy('server.js')
                .copy('socket.js')
                .copy('graphql.js')
                .target('config')
                .copy('default.js')
                .target('ssl')
                .copy('server.key')
                .copy('server.cert')
                .target('public')
                .copy('index.html')
                .copy('example.md')
                .commit();
        },
        condition: ALWAYS
    },
    {
        text: 'Add tasks to package.json',
        task: async () => {
            const description = `Node.js HTTP(S), WebSocket, and GraphQL servers with an 80% solution for security 'baked in'`;
            const main = 'index.js';
            const name = 'tomo-server';
            const scripts = {
                predev: 'npm run open',
                dev: 'stmux [ \"nodemon index.js\" .. \"npm run lint:watch\" ]',
                start: `node ${main}`,
                open: 'open-cli http://localhost:8111'
            };
            await (new PackageJsonEditor())
                .extend({description, main, name, scripts})
                .commit();
        },
        condition: () => allDoExist('package.json')
    },
    {
        text: 'Install dependencies',
        task: async ({skipInstall}) => {
            await install(DEPENDENCIES, {skipInstall});
            await install(DEV_DEPENDENCIES, {dev: true, skipInstall});
        },
        condition: () => allDoExist('package.json')
    }
];
export default tasks;