import {join} from 'path';
import {
    EslintConfigModuleEditor,
    PackageJsonEditor,
    Scaffolder,
    allDoExist,
    allDoExistSync,
    install
} from '../../api';

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
    'uuid',
    'npmlog',
    'protocolify',
    'ws'
];
const DEV_DEPENDENCIES = [
    'nodemon',
    'open-cli',
    'stmux',
    'supertest'
];
/**
 * @type {task[]}
 * @see https://expressjs.com/
 * @see https://github.com/websockets/ws
 * @see https://www.apollographql.com/docs/apollo-server/
 */
export const tasks = [
    {
        text: 'Copy server files',
        task: async ({overwrite}) => {
            await (new Scaffolder(join(__dirname, 'templates')))
                .overwrite(overwrite)
                .target('./')
                .copy('.env')
                .copy('favicon.ico')
                .copy('_gitignore', '.gitignore')
                .copy('index.js')
                .copy('server.js')
                .copy('socket.js')
                .copy('graphql.js')
                .copy('db.json')
                .target('config')
                .copy('default.js')
                .copy('default.js', 'test.js')
                .target('ssl')
                .copy('server.key')
                .copy('server.cert')
                .target('public')
                .copy('index.html')
                .copy('main.js')
                .copy('example.md')
                .target('__tests__')
                .overwrite(true)
                .copy('example.test.js')
                .commit();
        },
        condition: () => true
    },
    {
        text: 'Configure metadata and add tasks to package.json',
        task: async () => {
            const description = `Node.js HTTP(S), WebSocket, and GraphQL servers with an 80% solution for security 'baked in'`;
            const main = 'index.js';
            const name = 'tomo-server';
            const scripts = {
                predev: 'npm run open',
                dev: 'stmux [ \"nodemon index.js\" : \"npm run lint:ing\" ]',
                prestart: 'npm audit --production',
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
        text: 'Configure .eslintrc.js for use with Node.js',
        task: async ({browser}) => {
            const env = {
                browser,
                node: true
            };
            await (new EslintConfigModuleEditor())
                .extend({env})
                .commit();
        },
        condition: () => allDoExist('.eslintrc.js'),
        optional: () => allDoExistSync('.eslintrc.js')
    },
    {
        text: 'Install server dependencies',
        task: async ({skipInstall}) => {
            await install(DEPENDENCIES, {skipInstall});
            await install(DEV_DEPENDENCIES, {dev: true, skipInstall});
        },
        condition: ({skipInstall}) => !skipInstall && allDoExist('package.json')
    }
];
export default tasks;