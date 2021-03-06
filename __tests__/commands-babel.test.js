import {fileContents, run, useTemporaryDirectory} from './tomo-test';
import {createPackageJson} from '../src/commands/common';
import addBabel from '../src/commands/add-babel';

jest.mock('is-online', () => (async () => true));

describe('Babel', () => {
    let tempDirectory;
    const skipInstall = true;
    const useReact = true;
    const useRollup = true;
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
        await run(addBabel, {skipInstall});
        const pkg = fileContents('./package.json');
        const babelConfig = fileContents('./babel.config.js');
        expect(pkg).toMatchSnapshot();
        expect(babelConfig).toMatchSnapshot();
    });
    test('Add support (+React)', async () => {
        await run(createPackageJson, {});
        await run(addBabel, {skipInstall, useReact});
        const babelConfig = fileContents('./babel.config.js');
        expect(babelConfig).toMatchSnapshot();
    });
    test('Add support (+React+Rollup)', async () => {
        await run(createPackageJson, {});
        await run(addBabel, {skipInstall, useReact, useRollup});
        const babelConfig = fileContents('./babel.config.js');
        expect(babelConfig).toMatchSnapshot();
    });
});