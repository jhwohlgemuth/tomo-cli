import {
    getDirectoryTree,
    run,
    useTemporaryDirectory
} from './tomo-test';
// import {
//     createPackageJson,
//     createSourceDirectory
// } from '../src/commands/common';
import addBabel from '../src/commands/add-babel';
import addEsdoc from '../src/commands/add-esdoc';
import addEslint from '../src/commands/add-eslint';
// import addJest from '../src/commands/add-jest';
// import addPostcss from '../src/commands/add-postcss';
// import addRust from '../src/commands/add-rust';
import addMarionette from '../src/commands/add-marionette';
import addWebpack from '../src/commands/add-webpack';

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
    test('add-babel', async () => {
        const sourceDirectory = 'src';
        const options = {skipInstall, sourceDirectory};
        await run(addBabel, options);
        const tree = getDirectoryTree(tempDirectory);
        expect(tree).toMatchSnapshot();
    });
    test('add-babel (with React)', async () => {
        const sourceDirectory = 'src';
        const useReact = true;
        const options = {skipInstall, sourceDirectory, useReact};
        await run(addBabel, options);
        const tree = getDirectoryTree(tempDirectory);
        expect(tree).toMatchSnapshot();
    });
    test('add-esdoc', async () => {
        const sourceDirectory = 'src';
        const options = {skipInstall, sourceDirectory};
        await run(addEsdoc, options);
        const tree = getDirectoryTree(tempDirectory);
        expect(tree).toMatchSnapshot();
    });
    test('add-esdoc (with React)', async () => {
        const sourceDirectory = 'src';
        const useReact = true;
        const options = {skipInstall, sourceDirectory, useReact};
        await run(addEsdoc, options);
        const tree = getDirectoryTree(tempDirectory);
        expect(tree).toMatchSnapshot();
    });
    test('add-eslint', async () => {
        const sourceDirectory = 'src';
        const options = {skipInstall, sourceDirectory};
        await run(addEslint, options);
        const tree = getDirectoryTree(tempDirectory);
        expect(tree).toMatchSnapshot();
    });
    test('add-eslint (with React)', async () => {
        const sourceDirectory = 'src';
        const useReact = true;
        const options = {skipInstall, sourceDirectory, useReact};
        await run(addEslint, options);
        const tree = getDirectoryTree(tempDirectory);
        expect(tree).toMatchSnapshot();
    });
    test('add-marionette', async () => {
        const sourceDirectory = 'src';
        const options = {skipInstall, sourceDirectory};
        await run(addMarionette, options);
        const tree = getDirectoryTree(tempDirectory);
        expect(tree).toMatchSnapshot();
    });
    test('add-webpack', async () => {
        const sourceDirectory = 'src';
        const options = {skipInstall, sourceDirectory};
        await run(addWebpack, options);
        const tree = getDirectoryTree(tempDirectory);
        expect(tree).toMatchSnapshot();
    });
});
