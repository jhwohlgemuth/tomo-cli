import {join} from 'path';
import {
    EslintConfigModuleEditor,
    PackageJsonEditor,
    Scaffolder,
    allDoExist,
    allDoNotExist,
    createJsonEditor,
    install,
    uninstall
} from '../../api';

const ALWAYS = () => true;
const CYPRESS_DEPENDENCIES = [
    'cypress',
    'cypress-image-snapshot',
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
                baseUrl: `http://localhost:${port}`,
                video: false
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
                'cy:open': 'cypress open',
                'cy:run': 'cypress run',
                'cy:update': 'npm run cy:run -- --env updateSnapshots=true',
                'test:visual': 'npm-run-all --parallel start cy:open',
                'test:visual:update': 'del-cli ./cypress/snapshots',
                'test:visual:ci': 'npm-run-all --parallel start cy:run'
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
                .target('cypress/plugins')
                .copy('plugins/index.js', 'index.js')
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
        task: ({skipInstall}) => install([...CYPRESS_DEPENDENCIES, 'npm-run-all', 'del-cli'], {dev: true, skipInstall}),
        condition: ({isNotOffline, skipInstall}) => !skipInstall && isNotOffline && allDoExist('package.json')
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
                'cy:open': undefined,
                'cy:run': undefined,
                'cy:update': undefined,
                'test:visual': undefined,
                'test:visual:update': undefined,
                'test:visual:ci': undefined
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