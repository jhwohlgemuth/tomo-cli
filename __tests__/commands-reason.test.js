import {fileContents, getDirectoryTree, run, useTemporaryDirectory} from './tomo-test';
import {createPackageJson} from '../src/commands/common';
import {addReason, removeReason} from '../src/commands/add-reason';

jest.mock('is-online', () => (async () => true));

describe('Reason', () => {
    let tempDirectory;
    const skipInstall = true;
    const useReact = true;
    const options = {skipInstall, useReact};
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
        await run(addReason, options);
        const tree = getDirectoryTree(tempDirectory, {omit});
        const pkg = fileContents('package.json');
        const bsConfig = fileContents('bsconfig.json');
        expect(tree).toMatchSnapshot();
        expect(pkg).toMatchSnapshot();
        expect(bsConfig).toMatchSnapshot();
    });
    test('Remove support', async () => {
        await run(createPackageJson, {});
        await run(addReason, options);
        await run(removeReason, {skipInstall});
        const tree = getDirectoryTree(tempDirectory, {omit});
        const pkg = fileContents('package.json');
        expect(tree).toMatchSnapshot();
        expect(pkg).toMatchSnapshot();
    });
});