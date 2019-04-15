import {
    EslintConfigModuleEditor,
    getIntendedInput,
    getVersions,
    install,
    PackageJsonEditor
} from '../src/utils';
import {join} from 'path';
import crypto from 'crypto';
import {mkdirp} from 'fs-extra';
import rimraf from 'rimraf';
import {tmpdir} from 'os';
import execa from 'execa';
import commands from '../src/commands';

jest.mock('execa');

const testDirectory = join(__dirname, 'fixtures');

describe('package.json mem-fs editor', () => {
    let pkg;
    beforeEach(() => {
        pkg = new PackageJsonEditor(testDirectory);
    });
    test('create', () => {
        pkg = new PackageJsonEditor('/some/directory');
        expect(pkg.read()).toEqual('');
        expect(pkg.create(false).read()).toMatchSnapshot();
    });
    test('read', () => {
        expect(pkg.read()).toMatchSnapshot();
    });
    test('extend', () => {
        expect(pkg.extend({scripts: {foo: 'bar'}}, false).read()).toMatchSnapshot();
    });
    test('copy', () => {
        const newDirPath = join(testDirectory, 'new');
        pkg.copy(newDirPath, false);
        expect(pkg.fs.readJSON(join(newDirPath, 'package.json'))).toMatchSnapshot();
    });
    test('delete', () => {
        pkg = new PackageJsonEditor('/some/directory');
        expect(pkg.read()).toEqual('');
        expect(pkg.create(false).read()).toMatchSnapshot();
        expect(pkg.delete(false).read()).toEqual('');
    });
});
describe('.eslintrc.js mem-fs editor', () => {
    let cfg;
    beforeEach(() => {
        cfg = new EslintConfigModuleEditor(testDirectory);
    });
    test('create', () => {
        cfg = new EslintConfigModuleEditor('/some/directory');
        expect(cfg.read()).toEqual('');
        expect(cfg.create(false).read()).toMatchSnapshot();
    });
    test('read', () => {
        expect(cfg.read()).toMatchSnapshot();
    });
    test('extend', () => {
        expect(cfg.read()).toMatchSnapshot();
        expect(cfg.extend({key: {foo: `'foo'`}}, false).read()).toMatchSnapshot();
        expect(cfg.extend({key: {bar: `'bar'`}}, false).read()).toMatchSnapshot();
    });
    test('delete', () => {
        cfg = new EslintConfigModuleEditor('/some/directory');
        expect(cfg.read()).toEqual('');
        expect(cfg.create(false).read()).toMatchSnapshot();
        expect(cfg.delete(false).read()).toEqual('');
    });
    test('prepend', () => {
        expect(cfg.prepend(`const {existsSync} = require('fs-extra');`, false).read()).toMatchSnapshot();
        expect(cfg.prepend(`const {join} = require('path');`, false).read()).toMatchSnapshot();
        expect(cfg.extend({key: {baz: 'baz'}}, false).read()).toMatchSnapshot();
    });
});
describe('File & folder scaffolder', () => {
    let tempDirectory;
    beforeEach(async () => {
        tempDirectory = join(tmpdir(), `tomo-test-${crypto.randomBytes(20).toString('hex')}`);// eslint-disable-line no-magic-numbers
        await mkdirp(tempDirectory);
        process.chdir(tempDirectory);
    });
    afterEach(done => {
        rimraf(tempDirectory, done);
    });
    test('can copy files', async () => {
    });
});
describe('getIntendedInput', () => {
    test('return closest matches', () => {
        const [intendedCommand, intendedTerms] = getIntendedInput(commands, 'ad', ['lint']);
        expect(intendedCommand).toEqual('add');
        expect(intendedTerms).toEqual(['eslint']);
    });
});
describe('getVersions', () => {
    test('handle no module name', async () => {
        expect(await getVersions()).toEqual([]);
    });
    test('format response from npm', async () => {
        const stdout = '1.0.0 ,\n 2.0.0 ,\n 3.0.0 ';
        execa.mockResolvedValue({stdout});
        expect(await getVersions('some-module-name')).toMatchSnapshot();
    });
});
describe('install', () => {
    test('handle array of string names', async () => {
        const latest = true;
        const skipInstall = true;
        const dev = true;
        expect(await install()).toEqual(['install']);
        expect(await install(['some-module'])).toEqual(['install', 'some-module@latest']);
        expect(await install(['some-module'])).toEqual(['install', 'some-module@latest']);
        expect(await install(['some-module'], {latest: false, skipInstall})).toEqual(['install', 'some-module']);
        expect(await install(['foo', 'bar'], {latest: false, skipInstall})).toEqual(['install', 'foo', 'bar']);
        expect(await install(['some-module'], {dev, skipInstall})).toEqual(['install', 'some-module', '--save-dev']);
        expect(await install(['some-module'], {dev, latest, skipInstall})).toEqual(['install', 'some-module@latest', '--save-dev']);
        expect(await install(['foo', 'bar'], {latest: false, dev, skipInstall})).toEqual(['install', 'foo', 'bar', '--save-dev']);
    });
});
