import {fileContents, getDirectoryTree, run, useTemporaryDirectory} from './tomo-test';
import {createPackageJson} from '../src/commands/common';
import addEslint from '../src/commands/add-eslint';
import {addRollup, removeRollup} from '../src/commands/add-rollup';

jest.mock('is-online', () => (async () => true));

describeOnlyOnLinux('Rollup', () => {
    let tempDirectory;
    const skipInstall = true;
    const useReact = true;
    const omit = ['extension', 'path', 'size', 'type'];
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
        await run(addEslint, {skipInstall});
        await run(addRollup, {skipInstall});
        const tree = getDirectoryTree(tempDirectory, {omit});
        const pkg = fileContents('package.json');
        const rollupConfig = fileContents('rollup.config.js');
        expect(tree).toMatchSnapshot();
        expect(pkg).toMatchSnapshot();
        expect(rollupConfig).toMatchSnapshot();
    });
    test('Add support (+React)', async () => {
        await run(createPackageJson, {});
        await run(addEslint, {skipInstall, useReact});
        await run(addRollup, {skipInstall, useReact});
        const tree = getDirectoryTree(tempDirectory, {omit});
        const pkg = fileContents('package.json');
        const rollupConfig = fileContents('rollup.config.js');
        expect(tree).toMatchSnapshot();
        expect(pkg).toMatchSnapshot();
        expect(rollupConfig).toMatchSnapshot();
    });
    test('Remove support', async () => {
        await run(createPackageJson, {});
        await run(addEslint, {skipInstall});
        await run(addRollup, {skipInstall});
        await run(removeRollup, {skipInstall});
        const tree = getDirectoryTree(tempDirectory, {omit});
        const pkg = fileContents('package.json');
        expect(tree).toMatchSnapshot();
        expect(pkg).toMatchSnapshot();
    });
});