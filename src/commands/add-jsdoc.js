import {
    install,
    PackageJsonEditor,
    someDoExist
} from '../utils';

const pkg = new PackageJsonEditor();
/**
 * @ignore
 */
export const tasks = [
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
        text: 'Install Documentation.js dependencies',
        task: ({skipInstall}) => install(['jsdoc', 'opn-cli'], {dev: true, skipInstall}),
        condition: () => someDoExist('package.json')
    }
];
export default tasks;