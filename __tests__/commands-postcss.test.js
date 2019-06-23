import {fileContents, getDirectoryTree, run, useTemporaryDirectory} from './tomo-test';
import {createPackageJson} from '../src/commands/common';
import {addPostcss, removePostcss} from '../src/commands/add-postcss';

jest.mock('is-online', () => (async () => true));

describe('PostCSS', () => {
    let tempDirectory;
    const skipInstall = true;
    const assetsDirectory = './assets';
    const outputDirectory = './dist';
    const options = {assetsDirectory, skipInstall, outputDirectory};
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
        await run(addPostcss, options);
        const tree = getDirectoryTree(tempDirectory, {omit});
        const packageJson = fileContents('./package.json');
        const postcssConfig = fileContents('./postcss.config.js');
        expect(tree).toMatchSnapshot();
        expect(packageJson).toMatchSnapshot();
        expect(postcssConfig).toMatchSnapshot();
    });
    test('Remove support', async () => {
        await run(createPackageJson, {});
        await run(addPostcss, options);
        await run(removePostcss, {skipInstall});
        const tree = getDirectoryTree(tempDirectory, {omit});
        const packageJson = fileContents('./package.json');
        expect(tree).toMatchSnapshot();
        expect(packageJson).toMatchSnapshot();
    });
});