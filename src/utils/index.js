import {homedir, EOL} from 'os';
import {join} from 'path';
import {promisify} from 'util';
import {appendFile, mkdirp} from 'fs-extra';
import execa from 'execa';
import Queue from 'p-queue';
import semver from 'semver';
import readClosest from 'read-pkg-up';
import {complement, has, head} from 'ramda';
import isOnline from 'is-online';
import {oneLineTrim} from 'common-tags';
import npmArgumentParser from 'npm-package-arg';
import validate from 'validate-npm-package-name';
import {findBestMatch} from 'string-similarity';
import {dict, format, isEmptyString} from './common';
import createJsonEditor from './createJsonEditor';
import {createFunctionModuleEditor, createModuleEditor} from './createModuleEditor';

const append = promisify(appendFile);

const {assign, keys} = Object;
const {isArray} = Array;

// export {createFunctionModuleEditor, createJsonEditor, createModuleEditor};
// export *  from './common';
// export {MakefileEditor} from './MakefileEditor';
// export {Scaffolder} from './Scaffolder';

export const isUniqueTask = ({text}, index, tasks) => tasks.map(({text}) => text).indexOf(text) === index;
export const isValidTask = val => has('text', val) && has('task', val) && (typeof val.text === 'string') && (typeof val.task === 'function');
export const withOptions = val => options => ({...options, ...val});
/**
 * Choose tasks based on CLI options
 * @param {Object} choices Object to create choice dictionary from
 * @return {function} Accepts CLI options and returns array of tasks
 */
export const choose = choices => options => {
    const possible = keys(choices);
    const passed = keys(options);
    const lookup = dict(choices);
    const DEFAULT = lookup.has('default') ? lookup.get('default') : lookup.get(possible[0]);
    const [choice] = possible.filter(val => passed.includes(val)).filter(val => options[val]);
    return choice ? lookup.get(choice) : DEFAULT;
};
/**
 * Get duration since start in "HH:MM:SS" format
 * @param {object} start Time to determine duration from
 * @param {number[]} [initial=[0,0,0]] Duration to add to returned elapsed time
 * @example <caption>Start from 30 seconds</caption>
 * const [start] = process.hrtime()
 * const duration = getElapsedTime(start, [0, 0, 30]);
 * @return {string} Elapsed duration in format, "HH:MM:SS"
 */
export const getElapsedTime = (start, initial = [0, 0, 0]) => {
    const SECONDS_PER_MINUTE = 60;
    const MINUTES_PER_HOUR = SECONDS_PER_MINUTE;
    const after = (initial[0] * MINUTES_PER_HOUR * SECONDS_PER_MINUTE) + (initial[1] * SECONDS_PER_MINUTE) + initial[2];
    const total = process.hrtime()[0] + after - start;
    const seconds = total % SECONDS_PER_MINUTE;
    const minutes = Math.floor((total / SECONDS_PER_MINUTE) % MINUTES_PER_HOUR);
    const hours = Math.floor(total / MINUTES_PER_HOUR / SECONDS_PER_MINUTE);
    const format = val => val.toString().padStart(2, '0');
    return `${format(hours)}:${format(minutes)}:${format(seconds)}`;
};
/**
 * Convert elapsed duration to seconds
 * @param {string} duration Duration in format, "HH:MM:SS"
 * @return {number} Elapsed duration in seconds
 */
export const getElapsedSeconds = duration => duration
    .split(':')
    .map(Number)
    .reverse()
    .reduce((total, value, index) => ((60 ** index) * value) + total, 0); // eslint-disable-line no-magic-numbers
/**
 * Use string-similarity module to determine closest matching string
 * @param {Object} commands Object with commands as key values, terms as key values for each command object
 * @param {string} command Command string input
 * @param {string[]} [terms=[]] Terms input
 * @example
 * const [intendedCommand, intendedTerms] = getIntendedInput(commands, command, terms);
 * @return {string[]} [intendedCommand, intendedTerms] Array destructed assignment is recommended (see example)
 */
export const getIntendedInput = (commands, command = '', terms = []) => {
    const hasCommand = command.length > 0;
    const VALID_COMMANDS = keys(commands);
    const {bestMatch: {target: intendedCommand}} = findBestMatch(command, VALID_COMMANDS);
    const VALID_TERMS = keys(commands[intendedCommand]);
    const intendedTerms = terms.map(term => findBestMatch(term, VALID_TERMS).bestMatch.target);
    return {
        intendedCommand: hasCommand ? intendedCommand : undefined,
        intendedTerms: hasCommand ? intendedTerms : undefined
    };
};
/**
 * Append debug message to project-specific log file
 * @param {*} data Data to be stringified in log
 * @param {object} options Configuration options for function
 * @param {string} [options.filename=''] Name for debug file
 * @param {string} [options.title=''] Log title next to time stamp
 * @return {undefined} no return
 */
export const debug = async (data, options = {}) => {
    const {filename = 'tomo-cli-debug', store, title = ''} = options;
    const savepath = join(homedir(), `.${filename}`);
    const [date] = (new Date()).toISOString().split('T');
    const time = new Date().toLocaleTimeString('en-US', {hour12: false});
    const timestamp = `${date} ${time}`;
    try {
        const previous = store.get('debug') || [];
        store.set('debug', previous.concat([[
            `[${timestamp}] ${title}${EOL}`,
            format(data)
        ]]));
    } catch (_) {
        try {
            await mkdirp(savepath);
            await append(`${savepath}/debug`, `[${timestamp}] ${title}${EOL}`);
            await append(`${savepath}/debug`, format(data));
            isEmptyString(data) || await append(`${savepath}/debug`, EOL);
        } catch (_) {
            /* do nothing */
        }
    }
};
/**
 * Use npm CLI to return array of module versions
 * @param {string} name npm module name
 * @example
 * const versions = getVersions('react');
 * @return {string[]} Array of versions
 */
export const getVersions = async (name = '') => (name.length === 0) ? [] : (await execa('npm', ['view', name, 'versions']))
    .stdout
    .split(',\n')
    .map(str => str.match(/\d+[.]\d+[.]\d+/))
    .filter(isArray)
    .map(head)
    .map(semver.valid)
    .filter(Boolean);
/**
 * Show version listed in package.json and exit
 * @return {string} Version
 */
export const showVersion = () => {
    const {packageJson} = readClosest.sync();
    const {version} = packageJson;
    console.log(version); // eslint-disable-line no-console
    process.exit();
};
/**
 * Install dependencies with npm
 * @param {string[]} [dependencies=[]] Modules to install
 * @param {Object} options Options to configure installation
 * @param {boolean} [options.dev=false] If true, add "--save-dev"
 * @param {boolean} [options.latest=true] If true, add "@latest" to all module names
 * @param {boolean} [options.skipInstall=false] Do not install (mostly for testing)
 * @example <caption>Install production dependencies</caption>
 * install(['react']);
 * @example <caption>Install development dependencies</caption>
 * install(['jest', 'babel-jest'], {dev: true});
 * @return {string[]} Array of inputs (mostly for testing)
 */
export const install = async (dependencies = [], options = {dev: false, latest: false, skipInstall: false}) => {
    const {dev, latest, skipInstall} = options;
    const args = ['install']
        .concat(dependencies
            .map(str => {
                let data;
                try {
                    data = npmArgumentParser(str);
                } catch {
                    data = {};
                }
                return data;
            })
            .filter(({name}) => validate(name).validForNewPackages)
            .map(({name, fetchSpec}) => {
                const version = latest ? 'latest' : fetchSpec;
                return `${name}@${version}`;
            }))
        .concat(dev ? '--save-dev' : []);
    skipInstall || await execa('npm', args);
    return args;
};
export const uninstall = async (dependencies = []) => {
    const args = ['uninstall'].concat(dependencies.filter(name => validate(name).validForNewPackages));
    (args.length === 1) || await execa('npm', args);
    return args;
};
/**
 * Add async tasks to a queue, handle completion with actions dispatched via dispatch function
 * @param {Object} data Data to be used for populating queue
 * @param {Queue} [data.queue={}] p-queue instance
 * @param {Object[]} [data.tasks=[]] Array of task objects
 * @param {function} [data.dispatch=()=>{}] Function to dispatch task completion (complete, skip, error) actions
 * @param {Object} [data.options={}] Options object to pass to task function
 * @return {undefined} Returns nothing (side effects only)
 */
export async function populateQueue({concurrency = 1, tasks = [], dispatch = () => {}, options = {skipInstall: false}} = {}) {
    const {skipInstall} = options;
    const isNotOffline = skipInstall || await isOnline();
    const customOptions = assign({}, tasks.filter(complement(isValidTask)).reduce((acc, val) => assign(acc, val), options), {isNotOffline});
    const queue = new Queue({concurrency});
    dispatch({type: 'status', payload: {online: isNotOffline}});
    for (const [index, item] of tasks.filter(isValidTask).filter(isUniqueTask).entries()) {
        const {condition, task} = item;
        try {
            if (await condition(customOptions)) {
                await queue
                    .add(() => task(customOptions))
                    .then(() => dispatch({type: 'complete', payload: index}))
                    .catch(() => {
                        dispatch({
                            type: 'error', payload: {
                                index,
                                title: 'Failed to add task to queue',
                                location: 'task',
                                details: item.text
                            }
                        });
                    });
            } else {
                dispatch({type: 'skipped', payload: index});
            }
        } catch (error) {
            dispatch({
                type: 'error',
                payload: {
                    error,
                    index,
                    title: 'Failed to test task conditions',
                    location: 'condition',
                    details: item.text
                }
            });
        }
    }
}
/**
 * Create and edit a Babel.js configuration file with a fluent API
 * @type {ModuleEditor}
 * @example <caption>Extend module.exports content and prepend text to the top of the file</caption>
 * await (new BabelConfigModuleEditor())
 *     .create()
 *     .extend({presets: [`'@babel/preset-env'`]})
 *     .prepend(`const {existsSync} = require('fs-extra');`)
 *     .commit();
 */
export const BabelConfigModuleEditor = createModuleEditor('babel.config.js', {
    plugins: [
        `'@babel/plugin-transform-runtime'`,
        `'@babel/plugin-proposal-class-properties'`,
        `'@babel/plugin-proposal-export-default-from'`,
        `'@babel/plugin-proposal-optional-chaining'`
    ],
    presets: [`'@babel/preset-env'`, `'babel-preset-minify'`]
});
/**
 * Create and edit an ESLint configuration file with a fluent API
 * @type {ModuleEditor}
 * @example
 * await (new EslintConfigModuleEditor())
 *     .create()
 *     .commit();
 */
export const EslintConfigModuleEditor = createModuleEditor('.eslintrc.js', {
    env: {
        es6: true,
        jest: true
    },
    extends: [
        `'omaha-prime-grade'`
    ],
    parser: `'babel-eslint'`
});
/**
 * Create and edit a package.json manifest file with a fluent API
 * @type {JsonEditor}
 * @example <caption>Create a new package.json</caption>
 * await (new PackageJsonEditor())
 *     .create()
 *     .commit();
 * @example <caption>Create a new package.json and read its contents (chaining OK)</caption>
 * const contents = (new PackageJsonEditor())
 *     .create()
 *     .read();
 * @example <caption>Extend a package.json</caption>
 * const script = {test: 'jest --coverage'};
 * await (new PackageJsonEditor())
 *     .extend({script})
 *     .commit();
 * @example <caption>Create and extend a package.json without writing to disk (chaining OK)</caption>
 * const script = {
 *     lint: 'eslint index.js -c ./.eslintrc.js'
 * };
 * await (new PackageJsonEditor())
 *     .create(false)
 *     .extend({script}, false)
 *     .commit();
 */
export const PackageJsonEditor = createJsonEditor('package.json', {
    name: 'my-project',
    version: '0.0.0',
    description: 'A super cool app/server/tool/library/widget/thingy',
    license: 'MIT',
    keywords: []
});
export const BsConfigJsonEditor = createJsonEditor('bsconfig.json', {
    'bs-dependencies': ['reason-react'],
    'bsc-flags': ['-bs-super-errors'],
    namespace: true,
    'package-specs': [{
        module: 'es6',
        'in-source': true
    }],
    'ppx-flags': [],
    reason: {'react-jsx': 3},
    refmt: 3,
    sources: [{
        dir: 'src',
        subdirs: true
    }],
    suffix: '.bs.js'
});
/**
 * Create and edit a PostCSS configuration file with a fluent API
 * @type {ModuleEditor}
 * @example
 * await (new PostcssConfigEditor())
 *     .create()
 *     .commit();
 */
export const PostcssConfigEditor = createModuleEditor('postcss.config.js', {
    map: true,
    parser: `require('postcss-safe-parser')`
});
/**
 * Create and edit a PurgeCSS configuration file with a fluent API
 * @type {ModuleEditor}
 * @example
 * await (new PurgecssConfigEditor())
 *     .create()
 *     .commit();
 */
export const PurgecssConfigEditor = createModuleEditor('purgecss.config.js', {
    content: [`'./assets/index.html'`]
});
/**
 * Create and edit a Rollup configuration file with a fluent API
 * @type {ModuleEditor}
 * @example
 * await (new RollupConfigEditor())
 *     .create()
 *     .commit();
 */
export const RollupConfigEditor = createModuleEditor('rollup.config.js', {
    input: `'./src/main.js'`,
    output: {
        file: `'./dist/bundle.min.js'`,
        format: `'iife'`,
        sourcemap: `'inline'`
    },
    plugins: [
        `babel({exclude: 'node_modules/**', runtimeHelpers: true})`,
        oneLineTrim`commonjs({
            namedExports: {
                './node_modules/backbone/backbone.js': ['Model', 'history'],
                './node_modules/backbone.marionette/lib/backbone.marionette.js': ['Application', 'View', 'MnObject']
            }
        })`,
        `resolve({browser: true})`,
        `replace({'process.env.NODE_ENV': JSON.stringify('production')})`,
        `terser()`
    ]
}, {esm: true});
export const SnowpackConfigEditor = createModuleEditor('snowpack.config.js', {
    extends: `'@snowpack/app-scripts-react'`,
    mount: {
        assets: `'/'`
    },
    plugins: [`'@snowpack/plugin-react-refresh', '@snowpack/plugin-postcss'`]
});
/**
 * Create and edit a Webpack configuration file with a fluent API
 * @type {ModuleEditor}
 * @example
 * await (new WebpackConfigEditor())
 *     .create()
 *     .commit();
 */
export const WebpackConfigEditor = createFunctionModuleEditor('webpack.config.js', {
    mode: `argv.mode === 'production' ? 'production' : 'development'`,
    entry: {
        app: `'./src/main.js'`
    },
    devtool: `(argv.mode === 'production') ? void 0 : 'eval-source-map'`,
    output: {
        path: `resolve('./dist')`,
        filename: `'bundle.min.js'`,
        crossOriginLoading: `'anonymous'`
    }
}, {params: ['env', 'argv']});