import {
    getDirectoryTree,
    useTemporaryDirectory
} from './tomo-test';
import addMarionette from '../src/commands/add-marionette';

jest.mock('execa');

xdescribe('Commands', () => {
    let tempDirectory;
    const [setTempDir, cleanupTempDir] = useTemporaryDirectory();
    beforeEach(async () => {
        tempDirectory = await setTempDir();
        process.chdir(tempDirectory);
    });
    afterEach(async () => {
        await cleanupTempDir();
    });
    test('add-marionette', async () => {
        const sourceDirectory = 'src';
        const skipInstall = true;
        const options = {skipInstall, sourceDirectory};
        const tasks = addMarionette
            .map(({task}) => task)
            .map(task => task(options));
        await Promise.all(tasks);
        const tree = getDirectoryTree(tempDirectory, {omit: ['extension', 'path']});
        expect(tree).toMatchSnapshot();
    });
    test('add-lit-html', () => {
        expect(true).toEqual(true);
    });
});
