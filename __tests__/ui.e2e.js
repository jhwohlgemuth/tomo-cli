import execa from 'execa';
import {
    useTemporaryDirectory
} from './tomo-test';

const MAX_TIMEOUT = 300000;
jest.setTimeout(MAX_TIMEOUT);

describe('tomo', () => {
    let tempDirectory;
    const [setTempDir, cleanupTempDir] = useTemporaryDirectory();
    beforeEach(async () => {
        tempDirectory = await setTempDir();
        process.chdir(tempDirectory);
    });
    afterEach(async () => {
        await cleanupTempDir();
    });
    test('(no command or terms)', async () => {
        expect(process.cwd()).toBe(tempDirectory);
        const {stdout} = await execa('tomo');
        expect(stdout).toMatchSnapshot();
    });
    xtest('add', async () => {
        expect(process.cwd()).toBe(tempDirectory);
        // const {stdout} = await execa('tomo', ['add']);
        // expect(stdout).toMatchSnapshot();
    });
    test('add eslint --skip-install', async () => {
        expect(process.cwd()).toBe(tempDirectory);
        // const {stdout} = await execa('tomo', ['add', 'eslint', '--skip-install']);
        // console.log(stdout);
    });
});