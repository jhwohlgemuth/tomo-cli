import {fileContents, getDirectoryTree, run, useTemporaryDirectory} from './tomo-test';
import {createPackageJson} from '../src/commands/common';
import addEsdoc from '../src/commands/add-esdoc';

jest.mock('is-online', () => (async () => true));

describe('ESDoc', () => {
    let tempDirectory;
    const skipInstall = true;
    const sourceDirectory = './src';
    const useReact = true;
    const options = {skipInstall, sourceDirectory};
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
        await run(addEsdoc, options);
        const tree = getDirectoryTree(tempDirectory, {omit});
        const pkg = fileContents('./package.json');
        const esdocConfig = fileContents('./esdoc.conf.json');
        expect(tree).toMatchSnapshot();
        expect(pkg).toMatchSnapshot();
        expect(esdocConfig).toMatchSnapshot();
    });
    test('Add support (+React)', async () => {
        await run(createPackageJson, {});
        await run(addEsdoc, {...options, useReact});
        const esdocConfig = fileContents('./esdoc.conf.json');
        expect(esdocConfig).toMatchSnapshot();
    });
});