import {
    allDoNotExist,
    install,
    PackageJsonEditor,
    PostcssConfigEditor,
    someDoExist
} from '../utils';

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
/** @ignore */
export const tasks = [
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
export default tasks;