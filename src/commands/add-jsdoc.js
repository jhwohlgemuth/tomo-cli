import {
    install,
    PackageJsonEditor,
    someDoExist
} from '../utils';

const pkg = new PackageJsonEditor();

export default [
    {
        text: 'Add documentation tasks to package.json',
        task: ({sourceDirectory}) => pkg.extend({
            script: {
                'lint:docs': `eslint ${sourceDirectory}/*.js ${sourceDirectory}/**/*.js --no-eslintrc --rule valid-jsdoc:error --parser babel-eslint`,
                'build:docs': `jsdoc ${sourceDirectory} -r --destination ./docs`,
                'open:docs': 'opn ./docs/index.html',
                predocs: 'npm run lint:docs',
                docs: 'npm run build:docs',
                postdocs: 'npm run open:docs'
            }
        }),
        condition: () => someDoExist('package.json')
    },
    {
        text: 'Install Documentation.js dependencies',
        task: ({skipInstall}) => install(['jsdoc', 'opn-cli'], {dev: true, skipInstall}),
        condition: () => someDoExist('package.json')
    }
];