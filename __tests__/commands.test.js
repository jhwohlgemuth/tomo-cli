import {
    getDirectoryTree,
    run,
    useTemporaryDirectory
} from './tomo-test';
import addEslint from '../src/commands/add-eslint';
import addMarionette from '../src/commands/add-marionette';
import addWebpack from '../src/commands/add-webpack';

jest.mock('execa');

describe('Commands', () => {
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
    xtest('add-eslint', async () => {
        const sourceDirectory = 'src';
        const options = {skipInstall, sourceDirectory};
        await run(addEslint, options);
        const tree = getDirectoryTree(tempDirectory, {omit: ['extension', 'path']});
        console.log(tree);
        // expect(tree).toMatchSnapshot();
    });
    xtest('add-marionette', async () => {
        const sourceDirectory = 'src';
        const options = {skipInstall, sourceDirectory};
        await run(addMarionette, options);
        const tree = getDirectoryTree(tempDirectory, {omit: ['extension', 'path']});
        expect(tree).toMatchSnapshot();
    });
    xtest('add-webpack', async () => {
        const sourceDirectory = 'src';
        const options = {skipInstall, sourceDirectory};
        await run(addWebpack, options);
        const tree = getDirectoryTree(tempDirectory, {omit: ['extension', 'path']});
        console.log(tree);
        // expect(tree).toMatchSnapshot();
    });
});
