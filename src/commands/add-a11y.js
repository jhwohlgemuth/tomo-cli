import {PackageJsonEditor, install} from '../utils';
import {someDoExist} from '../utils/common';
/**
 * @type {task[]}
 * @see http://pa11y.org/
 */
export const addA11y = [
    {
        text: 'Add a11y tasks to package.json',
        task: async ({sourceDirectory}) => {
            const scripts = {
                'lint:a11y': `${sourceDirectory}/index.html`
            };
            const pkg = new PackageJsonEditor();
            await pkg.extend({scripts}).commit();
        },
        condition: () => someDoExist('package.json')
    },
    {
        text: 'Install a11y dependencies',
        task: ({skipInstall}) => install(['pa11y'], {dev: true, skipInstall}),
        condition: ({isNotOffline}) => isNotOffline && someDoExist('package.json')
    }
];
export default addA11y;