import {
    PackageJsonEditor,
    PostcssConfigEditor,
    install
} from '../utils';
import {allDoNotExist, someDoExist} from '../utils/common';

const POSTCSS_DEPENDENCIES = [
    'cssnano',
    'postcss-cli',
    'postcss-reporter',
    'postcss-safe-parser',
    'postcss-import',
    'postcss-cssnext',
    'stylelint',
    'uncss'
];
/**
 * @type {task[]}
 * @see https://github.com/postcss/postcss
 */
export const addPostcss = [
    {
        text: 'Create PostCSS config file',
        task: async () => {
            const cfg = new PostcssConfigEditor();
            await cfg.create().commit();
        },
        condition: () => allDoNotExist('postcss.config.js')
    },
    {
        text: 'Add PostCSS tasks to package.json',
        task: async () => {
            const pkg = new PackageJsonEditor();
            await pkg.extend({}).commit();
        },
        condition: () => someDoExist('package.json')
    },
    {
        text: 'Install PostCSS dependencies',
        task: ({skipInstall}) => install([POSTCSS_DEPENDENCIES], {dev: true, skipInstall}),
        condition: () => someDoExist('package.json')
    }
];
export default addPostcss;