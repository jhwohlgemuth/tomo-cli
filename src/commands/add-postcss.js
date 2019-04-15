import {
    allDoNotExist,
    install,
    PackageJsonEditor,
    PostcssConfigEditor,
    someDoExist
} from '../utils';

const pkg = new PackageJsonEditor();
const cfg = new PostcssConfigEditor();

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

export default [
    {
        text: 'Create PostCSS config file',
        task: () => cfg.create(),
        condition: () => allDoNotExist('postcss.config.js')
    },
    {
        text: 'Install PostCSS dependencies',
        task: ({skipInstall}) => install([POSTCSS_DEPENDENCIES], {dev: true, skipInstall}),
        condition: () => someDoExist('package.json')
    },
    {
        text: 'Add PostCSS tasks to package.json',
        task: () => pkg.extend({

        }),
        condition: () => someDoExist('package.json')
    }
];