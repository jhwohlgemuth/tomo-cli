import {
    install,
    PackageJsonEditor,
    someDoExist
} from '../utils';

const pkg = new PackageJsonEditor();
/** @ignore */
export const tasks = [
    {
        text: 'Add a11y tasks to package.json',
        task: async ({sourceDirectory}) => {
            const script = {
                'lint:a11y': `${sourceDirectory}/index.html`
            };
            await pkg
                .extend({script})
                .commit();
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