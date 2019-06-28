import {fileContents, getDirectoryTree, run, useTemporaryDirectory} from './tomo-test';
import {createPackageJson} from '../src/commands/common';
import addEslint from '../src/commands/add-eslint';

jest.mock('is-online', () => (async () => true));

describe('ESLint', () => {
    let tempDirectory;
    const browser = true;
    const skipInstall = true;
    const useReact = true;
    const reactVersion = '16.8';
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
        const tree = getDirectoryTree(tempDirectory, {omit});
        const pkg = fileContents('./package.json');
        const eslintConfig = fileContents('./.eslintrc.js');
        expect(tree).toMatchSnapshot();
        expect(pkg).toMatchSnapshot();
        expect(eslintConfig).toMatchSnapshot();
    });
    test('Add support (+Browser)', async () => {
        await run(createPackageJson, {});
        await run(addEslint, {skipInstall, browser});
        const eslintConfig = fileContents('./.eslintrc.js');
        expect(eslintConfig).toMatchSnapshot();
    });
    test('Add support (+Browser+React)', async () => {
        await run(createPackageJson, {});
        await run(addEslint, {skipInstall, browser, useReact, reactVersion});
        const eslintConfig = fileContents('./.eslintrc.js');
        expect(eslintConfig).toMatchSnapshot();
    });
});