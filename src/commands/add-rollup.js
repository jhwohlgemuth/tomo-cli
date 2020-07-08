import {join} from 'path';
import {
    PackageJsonEditor,
    RollupConfigEditor,
    allDoExist,
    allDoNotExist,
    allDoExistSync,
    debug,
    install,
    uninstall
} from '../api';

const DEPLOY_SCRIPTS = {
    predeploy: 'npm-run-all clean build:es build:css copy:assets',
    deploy: 'echo \"Not yet implemented - now.sh or surge.sh are supported out of the box\" && exit 1'
};
const BUILD_DEPENDENCIES = [
    'cpy-cli',
    'del-cli',
    'npm-run-all'
];
const ROLLUP_DEPENDENCIES = [
    'rollup',
    'rollup-plugin-babel',
    'rollup-plugin-commonjs',
    'rollup-plugin-node-resolve',
    'rollup-plugin-replace',
    'rollup-plugin-terser'
];
/**
 * @type {task[]}
 * @see https://rollupjs.org/guide/en/
 */
export const addRollup = [
    {
        text: 'Create Rollup configuration file',
        task: async ({outputDirectory, sourceDirectory, useReact}) => {
            const input =  `'${sourceDirectory}/main.js${useReact ? 'x' : ''}'`;
            const output = {
                file: `'${outputDirectory}/bundle.min.js'`
            };
            const plugins = [, `commonjs()`]; // the commonjs plugin needs to be the second item in the array
            await (new RollupConfigEditor())
                .create()
                .prepend(`import {terser} from 'rollup-plugin-terser';`)
                .prepend(`import replace from 'rollup-plugin-replace';`)
                .prepend(`import resolve from 'rollup-plugin-node-resolve';`)
                .prepend(`import commonjs from 'rollup-plugin-commonjs';`)
                .prepend(`import babel from 'rollup-plugin-babel';`)
                .prepend(`/* eslint-disable max-len */`)
                .extend({input, output})
                .extend(useReact ? {plugins} : {})
                .commit();
        },
        condition: () => allDoNotExist('webpack.config.js')
    },
    {
        text: 'Add Rollup build tasks to package.json',
        task: async ({assetsDirectory, outputDirectory, sourceDirectory}) => {
            const scripts = {
                ...DEPLOY_SCRIPTS,
                clean: `del-cli ${outputDirectory}`,
                copy: 'npm-run-all --parallel copy:assets copy:index',
                'copy:assets': `cpy \"${assetsDirectory}/!(css)/**/*.*\" \"${assetsDirectory}/**/[.]*\" ${outputDirectory} --parents --recursive`,
                'copy:index': `cpy \"${assetsDirectory}/index.html\" ${outputDirectory}`,
                'prebuild:es': `del-cli ${join(outputDirectory, assetsDirectory)}`,
                'build:es': 'rollup -c',
                'postbuild:es': 'npm run copy',
                'watch:assets': `watch \"npm run copy\" ${assetsDirectory}`,
                'watch:es': `watch \"npm run build:es\" ${sourceDirectory}`
            };
            await (new PackageJsonEditor())
                .extend({scripts})
                .commit();
        },
        condition: () => allDoExist('package.json')
    },
    {
        text: 'Configure dev task',
        task: async ({skipInstall}) => {
            const scripts = {
                dev: 'stmux [ \"npm run watch:es\" : \"npm run lint:ing\" ]'
            };
            try {
                await install(['stmux'], {dev: true, skipInstall});
            } catch (err) {
                await debug(err, 'Failed to install stmux');
            }
            await (new PackageJsonEditor())
                .extend({scripts})
                .commit();
        },
        condition: () => allDoExist('package.json', '.eslintrc.js'),
        optional: () => allDoExistSync('package.json', '.eslintrc.js')
    },
    {
        text: 'Install Rollup dependencies',
        task: ({skipInstall}) => install([...BUILD_DEPENDENCIES, ...ROLLUP_DEPENDENCIES], {dev: true, skipInstall}),
        condition: ({skipInstall}) => !skipInstall && allDoExist('package.json')
    }
];
export const removeRollup = [
    {
        text: 'Delete Rollup configuration file',
        task: async () => {
            await (new RollupConfigEditor())
                .delete()
                .commit();
        },
        condition: () => allDoExist('rollup.config.js')
    },
    {
        text: 'Remove Rollup build tasks from package.json',
        task: async () => {
            const scripts = {
                copy: undefined,
                'copy:assets': undefined,
                'copy:index': undefined,
                'watch:assets': undefined,
                dev: undefined,
                'prebuild:es': undefined,
                'build:es': undefined,
                'postbuild:es': undefined,
                'watch:es': undefined
            };
            await (new PackageJsonEditor())
                .extend({scripts})
                .commit();
        },
        condition: () => allDoExist('package.json')
    },
    {
        text: 'Uninstall Rollup dependencies',
        task: () => uninstall([...BUILD_DEPENDENCIES, ...ROLLUP_DEPENDENCIES, 'stmux']),
        condition: () => allDoExist('package.json') && (new PackageJsonEditor()).hasAll(...ROLLUP_DEPENDENCIES)
    }
];
export default addRollup;