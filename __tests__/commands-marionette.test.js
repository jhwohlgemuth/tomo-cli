import {fileContents, getDirectoryTree, run, useTemporaryDirectory} from './tomo-test';
import {createPackageJson} from '../src/commands/common';
import addMarionette from '../src/commands/add-marionette';

jest.mock('is-online', () => (async () => true));

describe('Marionette', () => {
    let tempDirectory;
    const skipInstall = true;
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
        await run(addMarionette, {skipInstall});
        const tree = getDirectoryTree(tempDirectory, {omit});
        const pkg = fileContents('./package.json');
        expect(tree).toMatchSnapshot();
        expect(pkg).toMatchSnapshot();
    });
});