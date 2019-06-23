import {join} from 'path';
import {EslintConfigModuleEditor, PackageJsonEditor, install, uninstall} from '../../utils';
import {allDoExist, allDoNotExist} from '../../utils/common';
import {Scaffolder} from '../../utils/Scaffolder';
import createJsonEditor from '../../utils/createJsonEditor';

const ALWAYS = () => true;
const CYPRESS_DEPENDENCIES = [
    'cypress',
    'cypress-match-screenshot'
];
/**
 * @type {task[]}
 * @see https://www.cypress.io/
 */
export const addCypress = [
    {
        text: 'Create Cypress config file',
        task: async ({port}) => {
            const Editor = createJsonEditor('cypress.json', {
                baseUrl: `http://localhost:${port}`
            });
            await (new Editor())
                .create()
                .commit();
        },
        condition: () => allDoNotExist('cypress.json')
    },
    {
        text: 'Add Cypress test tasks to package.json',
        task: async () => {
            const scripts = {
                cypress: 'cypress open',
                'test:e2e': 'npm-run-all --parallel start cypress'
            };
            await (new PackageJsonEditor())
                .extend({scripts})
                .commit();
        },
        condition: () => allDoExist('package.json')
    },
    {
        text: 'Add Cypress global variable to .eslintrc.js',
        task: async () => {
            const globals = {cy: true};
            await (new EslintConfigModuleEditor())
                .extend({globals})
                .commit();
        },
        condition: () => allDoExist('.eslintrc.js')
    },
    {
        text: 'Copy Cypress files',
        task: async ({overwrite}) => {
            await (new Scaffolder(join(__dirname, 'templates')))
                .overwrite(overwrite)
                .target('cypress/support')
                .copy('support/index.js', 'index.js')
                .copy('support/commands.js', 'commands.js')
                .target('cypress/integration')
                .copy('visual-regression.test.js')
                .commit();
        },
        condition: ALWAYS
    },
    {
        text: 'Install Cypress dependencies',
        task: ({skipInstall}) => install([...CYPRESS_DEPENDENCIES, 'npm-run-all'], {dev: true, skipInstall}),
        condition: ({isNotOffline}) => isNotOffline && allDoExist('package.json')
    }
];
export const removeCypress = [
    {
        text: 'Delete Cypress config file',
        task: async () => {
            const Editor = createJsonEditor('cypress.json');
            await (new Editor())
                .delete()
                .commit();
        },
        condition: () => allDoExist('cypress.json')
    },
    {
        text: 'Remove Cypress test tasks from package.json',
        task: async () => {
            const scripts = {
                cypress: undefined,
                'test:e2e': undefined
            };
            await (new PackageJsonEditor())
                .extend({scripts})
                .commit();
        },
        condition: () => allDoExist('package.json')
    },
    {
        text: 'Remove Cypress global variable from .eslintrc.js',
        task: async () => {
            const globals = {cy: false};
            await (new EslintConfigModuleEditor())
                .extend({globals})
                .commit();
        },
        condition: () => allDoExist('.eslintrc.js')
    },
    {
        text: 'Uninstall Cypress dependencies',
        task: () => uninstall(CYPRESS_DEPENDENCIES),
        condition: ({skipInstall}) => !skipInstall && allDoExist('package.json') && (new PackageJsonEditor()).hasAll(...CYPRESS_DEPENDENCIES),
        optional: ({skipInstall}) => !skipInstall
    }
];
export default addCypress;