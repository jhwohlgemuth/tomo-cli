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
const cfg = new EsdocJsonEditor();
const pkg = new PackageJsonEditor();
/**
 * @ignore
 */
export const tasks = [
    {
        text: 'Create esdoc configuration file',
        task: async () => {
            await cfg.create().commit();
        },
        condition: () => allDoNotExist('esdoc.conf.json', '.esdoc.json')
    },
    {
        text: 'Add documentation tasks to package.json',
        task: async ({sourceDirectory}) => {
            await pkg.extend({
                script: {
                    'lint:docs': `eslint . --no-eslintrc --rule valid-jsdoc:error --parser babel-eslint`,
                    'build:docs': `jsdoc ${sourceDirectory} -r --destination ./docs`,
                    'open:docs': 'opn ./docs/index.html',
                    predocs: 'npm run lint:docs',
                    docs: 'npm run build:docs',
                    postdocs: 'npm run open:docs'
                }
            }).commit();
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