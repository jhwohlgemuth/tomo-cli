import {fileContents, run, useTemporaryDirectory} from './tomo-test';
import {createPackageJson} from '../src/commands/common';
import {addPostcss} from '../src/commands/add-postcss';
import {addWebpack} from '../src/commands/add-webpack';
import {addBrowsersync, removeBrowsersync} from '../src/commands/add-browsersync';

jest.mock('is-online', () => (async () => true));

describeOnlyOnLinux('Browsersync', () => {
    let tempDirectory;
    const skipInstall = true;
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
        await run(addBrowsersync, {skipInstall});
        const noop = fileContents('./package.json');
        await run(addWebpack, {skipInstall});
        await run(addPostcss, {skipInstall});
        await run(addBrowsersync, {skipInstall});
        const packageJson = fileContents('./package.json');
        expect(noop).toMatchSnapshot();
        expect(packageJson).toMatchSnapshot();
    });
    test('Remove support', async () => {
        await run(createPackageJson, {});
        await run(addWebpack, {skipInstall});
        await run(addPostcss, {skipInstall});
        await run(addBrowsersync, {skipInstall});
        await run(removeBrowsersync, {skipInstall});
        const packageJson = fileContents('./package.json');
        expect(packageJson).toMatchSnapshot();
    });
});