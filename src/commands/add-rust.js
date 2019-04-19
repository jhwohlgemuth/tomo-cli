/* eslint-disable max-len */
import {arrowRight} from 'figures';
import {
    PackageJsonEditor,
    someDoExist
} from '../utils';

const pkg = new PackageJsonEditor();
/** @ignore */
export const tasks = [
    {
        text: `Add Rust ${arrowRight} WASM build tasks to package.json`,
        task: async ({assetsDirectory}) => {
            const script = {
                'build:wasm': `rustc +nightly --target wasm32-unknown-unknown -O --crate-type=cdylib ${assetsDirectory}/rust/main.rs -o ./${assetsDirectory}/rust/main.wasm`,
                'postbuild:wasm': `wasm-gc ${assetsDirectory}/rust/main.wasm ${assetsDirectory}/rust/main.min.wasm`
            };
            await pkg.extend({script}).commit();
        },
        condition: () => someDoExist('package.json')
    }
];
export default tasks;