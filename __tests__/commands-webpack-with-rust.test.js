import {fileContents, run, useTemporaryDirectory} from './tomo-test';
import {createPackageJson} from '../src/commands/common';
import addBabel from '../src/commands/add-babel';
import addEslint from '../src/commands/add-eslint';
import {addWebpack} from '../src/commands/add-webpack';

jest.mock('is-online', () => (async () => true));

describe('Webpack with Rust', () => {
    let tempDirectory;
    const skipInstall = true;
    const useReact = true;
    const withRust = true;
    const [setTempDir, cleanupTempDir] = useTemporaryDirectory();
    beforeEach(async () => {
        tempDirectory = await setTempDir();
        process.chdir(tempDirectory);
    });
    afterEach(async () => {
        await cleanupTempDir();
    });
    test('Add support', async () => {
        await run(createPackageJson, {});
        await run(addBabel, {skipInstall});
        await run(addEslint, {skipInstall});
        await run(addWebpack, {skipInstall, withRust});
        const webpackConfig = fileContents('./webpack.config.js');
        expect(webpackConfig).toMatchSnapshot();
    });
    test('Add support (+React)', async () => {
        await run(createPackageJson, {});
        await run(addBabel, {skipInstall});
        await run(addEslint, {skipInstall});
        await run(addWebpack, {skipInstall, withRust, useReact});
        const webpackConfig = fileContents('./webpack.config.js');
        expect(webpackConfig).toMatchSnapshot();
    });
});