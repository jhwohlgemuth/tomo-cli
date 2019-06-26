import {fileContents, getDirectoryTree, run, useTemporaryDirectory} from './tomo-test';
import {createPackageJson} from '../src/commands/common';
import addEslint from '../src/commands/add-eslint';
import {addParcel, removeParcel} from '../src/commands/add-parcel';

jest.mock('is-online', () => (async () => true));

describe('Parcel', () => {
    let tempDirectory;
    const skipInstall = true;
    const outputDirectory = './dist';
    const sourceDirectory = './src';
    const options = {skipInstall, outputDirectory, sourceDirectory};
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
        await run(addEslint, options);
        await run(addParcel, options);
        const pkg = fileContents('./package.json');
        const purgecssConfig = fileContents('./purgecss.config.js');
        expect(pkg).toMatchSnapshot();
        expect(purgecssConfig).toMatchSnapshot();
    });
    test('Remove support', async () => {
        await run(createPackageJson, {});
        await run(addEslint, options);
        await run(addParcel, options);
        await run(removeParcel, {skipInstall});
        const tree = getDirectoryTree(tempDirectory, {omit});
        const pkg = fileContents('./package.json');
        expect(tree).toMatchSnapshot();
        expect(pkg).toMatchSnapshot();
    });
});