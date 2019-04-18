/* eslint-disable max-len */
import {arrowRight} from 'figures';
import {
    PackageJsonEditor,
    someDoExist
} from '../utils';

const pkg = new PackageJsonEditor();

export default [
    {
        text: `Add Rust ${arrowRight} WASM build tasks to package.json`,
        task: async ({assetsDirectory}) => {
            await pkg.extend({
                script: {
                    'build:wasm': `rustc +nightly --target wasm32-unknown-unknown -O --crate-type=cdylib ${assetsDirectory}/rust/main.rs -o ./${assetsDirectory}/rust/main.wasm`,
                    'postbuild:wasm': `wasm-gc ${assetsDirectory}/rust/main.wasm ${assetsDirectory}/rust/main.min.wasm`
                }
            }).commit();
        },
        condition: () => someDoExist('package.json')
    }
];