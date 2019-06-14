import {
    PackageJsonEditor,
    PostcssConfigEditor,
    install,
    uninstall
} from '../utils';
import {allDoNotExist, someDoExist} from '../utils/common';

const POSTCSS_DEPENDENCIES = [
    'cssnano',
    'postcss-cli',
    'postcss-normalize',
    'postcss-reporter',
    'postcss-safe-parser',
    'postcss-import',
    'postcss-preset-env',
    'stylelint',
    'stylelint-config-recommended',
    'uncss'
];
/**
 * @type {task[]}
 * @see https://github.com/postcss/postcss
 */
export const addPostcss = [
    {
        text: 'Create PostCSS config file',
        task: async ({outputDirectory, useParcel}) => {
            const plugins = [
                `require('stylelint')({config: {extends: 'stylelint-config-recommended'}})`,
                ...(useParcel ? [] : [`require('uncss').postcssPlugin({html: ['${outputDirectory}/index.html']})`]),
                `require('postcss-import')()`,
                `require('postcss-preset-env')({stage: 0})`,
                `require('postcss-normalize')({browsers: 'last 2 versions'})`,
                `require('cssnano')()`,
                `require('postcss-reporter')({clearReportedMessages: true})`
            ];
            await (new PostcssConfigEditor())
                .create()
                .extend({plugins})
                .commit();
        },
        condition: () => allDoNotExist('postcss.config.js')
    },
    {
        text: 'Add PostCSS tasks to package.json',
        task: async ({assetsDirectory, outputDirectory}) => {
            const scripts = {
                'build:css': `postcss ${assetsDirectory}/css/style.css --dir ${outputDirectory}`,
                'watch:css': 'npm run build:css -- --watch'
            };
            await (new PackageJsonEditor())
                .extend({scripts})
                .commit();
        },
        condition: () => someDoExist('package.json')
    },
    {
        text: 'Install PostCSS dependencies',
        task: ({skipInstall}) => install(POSTCSS_DEPENDENCIES, {dev: true, skipInstall}),
        condition: ({isNotOffline}) => isNotOffline && someDoExist('package.json')
    }
];
export const removePostcss = [
    {
        text: 'Delete PostCSS config file',
        task: async () => {
            await (new PostcssConfigEditor())
                .delete()
                .commit();
        },
        condition: () => someDoExist('postcss.config.js')
    },
    {
        text: 'Remove PostCSS build task from package.json',
        task: async () => {
            const scripts = {
                'build:css': undefined,
                'watch:css': undefined
            };
            await (new PackageJsonEditor())
                .extend({scripts})
                .commit();
        },
        condition: () => someDoExist('package.json')
    },
    {
        text: 'Uninstall PostCSS dependencies',
        task: () => uninstall(POSTCSS_DEPENDENCIES),
        condition: ({skipInstall}) => !skipInstall && someDoExist('package.json') && (new PackageJsonEditor()).hasAll(...POSTCSS_DEPENDENCIES),
        optional: ({skipInstall}) => !skipInstall
    }
];
export default addPostcss;