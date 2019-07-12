import {existsSync} from 'fs';
import {join} from 'path';
import {removeAttributes, getDirectoryTree, useTemporaryDirectory} from './tomo-test';
import {format} from '../src/utils/common';

describe('Tomo testing tools', () => {
    test('can create and cleanup temporary directories', async () => {
        const [setTempDir, cleanupTempDir] = useTemporaryDirectory();
        const tempDir = await setTempDir();
        expect(existsSync(tempDir)).toBeTruthy();
        await cleanupTempDir();
        expect(existsSync(tempDir)).not.toBeTruthy();
    });
    test('can format objects for use as snapshots', () => {
        const data = {
            path: 'a',
            type: 'directory',
            children: [
                {
                    path: 'aa',
                    type: 'file'
                },
                {
                    path: 'b',
                    type: 'directory',
                    children: [
                        {
                            path: 'c',
                            type: 'directory',
                            children: [
                                {
                                    path: 'd',
                                    type: 'file'
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        const result = removeAttributes(data, 'path');
        expect(format(result)).toMatchSnapshot();
    });
    test('get directory tree', () => {
        const folderpath = join(__dirname, 'tomo-fixtures/test-folder-tree');
        const tree = getDirectoryTree(folderpath);
        expect(tree).toMatchSnapshot();
        const augmentedTree = getDirectoryTree(folderpath, {omit: ['path', 'name']});
        expect(augmentedTree).toMatchSnapshot();
    });
});