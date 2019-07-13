import {PackageJsonEditor, install} from '../utils';
import {allDoExist, allDoNotExist} from '../utils/common';
import createJsonEditor from '../utils/createJsonEditor';

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
    'esdoc-jsx-plugin',
    'esdoc-ecmascript-proposal-plugin',
    'esdoc-standard-plugin'
];
const ESDOC_REACT_PLUGINS = [
    'esdoc-jsx-plugin'
];
const EsdocJsonEditor = createJsonEditor('esdoc.conf.json', ESDOC_CONF);
/**
 * @type {task[]}
 * @see https://esdoc.org/
 */
export const addEsdoc = [
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
        task: async () => {
            const scripts = {
                'lint:docs': `eslint . --no-eslintrc --rule valid-jsdoc:error --parser babel-eslint`,
                predocs: 'npm run lint:docs',
                docs: `esdoc -c esdoc.conf.json`,
                postdocs: 'open-cli ./docs/index.html'
            };
            const pkg = new PackageJsonEditor();
            await pkg.extend({scripts}).commit();
        },
        condition: () => allDoExist('package.json')
    },
    {
        text: 'Install esdoc dependencies',
        task: ({skipInstall}) => install([...ESDOC_DEPENDENCIES, 'open-cli'], {dev: true, skipInstall}),
        condition: ({isNotOffline, skipInstall}) => !skipInstall && isNotOffline && allDoExist('package.json')
    },
    {
        text: 'Install esdoc React plugins',
        task: ({skipInstall}) => install(ESDOC_REACT_PLUGINS, {dev: true, skipInstall}),
        condition: ({isNotOffline, skipInstall, useReact}) => !skipInstall && isNotOffline && useReact && allDoExist('package.json'),
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
        condition: ({useReact}) => useReact && allDoExist('esdoc.conf.json'),
        optional: ({useReact}) => useReact
    }
];
export default addEsdoc;