import {fileContents, getDirectoryTree, run, useTemporaryDirectory} from './tomo-test';
import {createPackageJson} from '../src/commands/common';
import addElectron from '../src/commands/add-electron';

jest.mock('is-online', () => (async () => true));

describe('Electron', () => {
    let tempDirectory;
    const skipInstall = true;
    const useParcel = true;
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
        await run(addElectron, {skipInstall});
        const tree = getDirectoryTree(tempDirectory, {omit});
        const pkg = fileContents('package.json');
        expect(tree).toMatchSnapshot();
        expect(pkg).toMatchSnapshot();
    });
    test('Add support (+Parcel)', async () => {
        await run(createPackageJson, {});
        await run(addElectron, {skipInstall, useParcel});
        const pkg = fileContents('package.json');
        expect(pkg).toMatchSnapshot();
    });
});