/* eslint-disable max-len */
import {arrowRight} from 'figures';
import {PackageJsonEditor} from '../utils';
import {someDoExist} from '../utils/common';
/**
 * @type {task[]}
 * @see https://webpack.js.org/
 */
export const rustTasks = [
    {
        text: `Add Rust ${arrowRight} WASM build tasks to package.json`,
        task: async ({assetsDirectory}) => {
            const scripts = {
                'build:wasm': `rustc +nightly --target wasm32-unknown-unknown -O --crate-type=cdylib ${assetsDirectory}/rust/main.rs -o ./${assetsDirectory}/rust/main.wasm`,
                'postbuild:wasm': `wasm-gc ${assetsDirectory}/rust/main.wasm ${assetsDirectory}/rust/main.min.wasm`
            };
            const pkg = new PackageJsonEditor();
            await pkg.extend({scripts}).commit();
        },
        condition: () => someDoExist('package.json')
    }
];
export default rustTasks;