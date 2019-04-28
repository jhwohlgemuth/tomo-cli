import {install, PackageJsonEditor} from '../utils';
import {someDoExist} from '../utils/common';

/** @ignore */
export const tasks = [
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
        condition: () => someDoExist('package.json')
    }
];
export default tasks;