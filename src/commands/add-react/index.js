import {join} from 'path';
import {PackageJsonEditor, install} from '../../utils';
import {allDoExist} from '../../utils/common';
import {Scaffolder} from '../../utils/Scaffolder';

const REACT_DEPENDENCIES = [
    'prop-types',
    'react',
    'react-dom'
];
const DEV_DEPENDENCIES = [
    'npm-run-all'
];
const ALWAYS = () => true;
/**
 * @type {task[]}
 * @see https://reactjs.org/
 */
export const addReact = [
    {
        text: 'Copy React boilerplate and assets',
        task: async ({assetsDirectory, sourceDirectory, overwrite, useParcel}) => {
            const index = useParcel ? 'index-in-place-react.html' : 'index-react.html';
            await (new Scaffolder(join(__dirname, 'templates')))
                .overwrite(overwrite)
                .target(sourceDirectory)
                .copy('main.js')
                .target(`${sourceDirectory}/components`)
                .copy('App.js')
                .commit();
            await (new Scaffolder(join(__dirname, '..', 'common', 'templates')))
                .overwrite(overwrite)
                .target(`${assetsDirectory}`)
                .copy(index, 'index.html')
                .target(`${assetsDirectory}/css`)
                .copy('style.css')
                .target(`${assetsDirectory}/images`)
                .copy('.gitkeep')
                .target(`${assetsDirectory}/fonts`)
                .copy('.gitkeep')
                .target(`${assetsDirectory}/library`)
                .copy('.gitkeep')
                .target(`${assetsDirectory}/workers`)
                .copy('.gitkeep')
                .commit();
        },
        condition: ALWAYS
    },
    {
        text: 'Set package.json "main" attribute and add scripts tasks',
        task: async ({sourceDirectory, useParcel}) => {
            const main = `${sourceDirectory}/main.js`;
            const scripts = {
                serve: 'webpack-dev-server --hot --open --mode development',
                start: 'npm-run-all --parallel build:css:watch serve'
            };
            await (new PackageJsonEditor())
                .extend({main})
                .extend(useParcel ? {} : {scripts})
                .commit();
        },
        condition: () => allDoExist('package.json')
    },
    {
        text: 'Install React dependencies',
        task: ({skipInstall}) => install([...REACT_DEPENDENCIES, ...DEV_DEPENDENCIES], {skipInstall}),
        condition: ({isNotOffline}) => isNotOffline && allDoExist('package.json')
    }
];
export default addReact;