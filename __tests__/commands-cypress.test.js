import {fileContents, getDirectoryTree, run, useTemporaryDirectory} from './tomo-test';
import {createPackageJson} from '../src/commands/common';
import {addCypress, removeCypress} from '../src/commands/add-cypress';
import addEslint from '../src/commands/add-eslint';

jest.mock('is-online', () => (async () => true));

describe('Cypress', () => {
    let tempDirectory;
    const skipInstall = true;
    const sourceDirectory = './src';
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
        await run(addEslint, options);
        await run(addCypress, options);
        const tree = getDirectoryTree(tempDirectory, {omit});
        const packageJson = fileContents('package.json');
        const cypressConfig = fileContents('cypress.json');
        const eslintConfig = fileContents('.eslintrc.js');
        expect(tree).toMatchSnapshot();
        expect(packageJson).toMatchSnapshot();
        expect(cypressConfig).toMatchSnapshot();
        expect(eslintConfig).toMatchSnapshot();
    });
    test('Remove support', async () => {
        await run(createPackageJson, {});
        await run(addEslint, options);
        await run(addCypress, options);
        await run(removeCypress, {});
        const tree = getDirectoryTree(tempDirectory, {omit});
        const packageJson = fileContents('package.json');
        const eslintConfig = fileContents('.eslintrc.js');
        expect(tree).toMatchSnapshot();
        expect(packageJson).toMatchSnapshot();
        expect(eslintConfig).toMatchSnapshot();
    });
});