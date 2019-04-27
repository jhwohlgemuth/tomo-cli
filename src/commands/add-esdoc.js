import {
    allDoNotExist,
    createJsonEditor,
    install,
    PackageJsonEditor,
    someDoExist
} from '../utils';

const ESDOC_CONF = {
    source: './src',
    destination: './docs',
    plugins: [
        {
            name: 'esdoc-standard-plugin'
        },
        {
            name: 'esdoc-ecmascript-proposal-plugin',
            option: {
                all: true
            }
        }
    ]
};
const ESDOC_DEPENDENCIES = [
    'esdoc',
    'esdoc-ecmascript-proposal-plugin',
    'esdoc-standard-plugin'
];
const ESDOC_REACT_PLUGINS = [
    'esdoc-jsx-plugin'
];
const EsdocJsonEditor = createJsonEditor('esdoc.conf.json', ESDOC_CONF);
/** @ignore */
export const tasks = [
    {
        text: 'Create esdoc configuration file',
        task: async () => {
            const cfg = new EsdocJsonEditor();
            await cfg.create().commit();
        },
        condition: () => allDoNotExist('esdoc.conf.json', '.esdoc.json')
    },
    {
        text: 'Add documentation tasks to package.json',
        task: async ({sourceDirectory}) => {
            const scripts = {
                'lint:documentation': `eslint . --no-eslintrc --rule valid-jsdoc:error --parser babel-eslint`,
                'build:documentation': `jsdoc ${sourceDirectory} -r --destination ./docs`,
                'open:documentation': 'opn ./docs/index.html',
                predocumentation: 'npm run lint:docs',
                documentation: 'npm run build:docs',
                postdocumentation: 'npm run open:docs'
            };
            const pkg = new PackageJsonEditor();
            await pkg.extend({scripts}).commit();
        },
        condition: () => someDoExist('package.json')
    },
    {
        text: 'Install esdoc dependencies',
        task: ({skipInstall}) => install([...ESDOC_DEPENDENCIES, 'opn-cli'], {dev: true, skipInstall}),
        condition: () => someDoExist('package.json')
    },
    {
        text: 'Install esdoc React plugins',
        task: ({skipInstall}) => install(ESDOC_REACT_PLUGINS, {dev: true, skipInstall}),
        condition: ({useReact}) => (useReact && someDoExist('package.json')),
        optional: ({useReact}) => useReact
    },
    {
        text: 'Add esdoc React plugin to configuration file',
        task: async () => {
            const {plugins} = ESDOC_CONF;
            const cfg = new EsdocJsonEditor();
            await cfg
                .extend({
                    plugins: [...plugins, {
                        name: 'esdoc-jsx-plugin',
                        options: {enable: true}
                    }]
                })
                .commit();
        },
        condition: ({useReact}) => (useReact && someDoExist('esdoc.conf.json')),
        optional: ({useReact}) => useReact
    }
];
export default tasks;