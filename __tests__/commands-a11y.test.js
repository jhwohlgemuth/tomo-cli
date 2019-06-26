import {fileContents, run, useTemporaryDirectory} from './tomo-test';
import {createPackageJson} from '../src/commands/common';
import {addA11y, removeA11y} from '../src/commands/add-a11y';

jest.mock('is-online', () => (async () => true));

describe('Accessibility', () => {
    let tempDirectory;
    const skipInstall = true;
    const outputDirectory = './dist';
    const options = {skipInstall, outputDirectory};
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
        await run(addA11y, options);
        const pkg = fileContents('package.json');
        expect(pkg).toMatchSnapshot();
    });
    test('Remove support', async () => {
        await run(createPackageJson, {});
        await run(addA11y, options);
        await run(removeA11y, {skipInstall});
        const pkg = fileContents('package.json');
        expect(pkg).toMatchSnapshot();
    });
});