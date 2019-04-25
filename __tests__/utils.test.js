import {
    EslintConfigModuleEditor,
    getIntendedInput,
    getVersions,
    install,
    MakefileEditor,
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
/**
 * Verify package.json editor can create and edit a package.json manifest file
 * @test {PackageJsonEditor}
 */
describe('package.json mem-fs editor', () => {
    let pkg;
    beforeEach(() => {
        pkg = new PackageJsonEditor(testDirectory);
    });
    test('create', async () => {
        pkg = new PackageJsonEditor('/some/directory');
        expect(pkg.read()).toEqual('');
        await pkg.create();
        expect(pkg.read()).toMatchSnapshot();
    });
    test('read', () => {
        expect(pkg.read()).toMatchSnapshot();
    });
    test('extend', async () => {
        await pkg.extend({scripts: {foo: 'bar'}});
        expect(pkg.read()).toMatchSnapshot();
    });
    test('copy', async () => {
        const newDirPath = join(testDirectory, 'new');
        await pkg.copy(newDirPath);
        expect(pkg.fs.readJSON(join(newDirPath, 'package.json'))).toMatchSnapshot();
    });
    test('delete', async () => {
        pkg = new PackageJsonEditor('/some/directory');
        expect(pkg.read()).toEqual('');
        await pkg.create();
        expect(pkg.read()).toMatchSnapshot();
        await pkg.delete();
        expect(pkg.read()).toEqual('');
    });
    test('hasSome', () => {
        expect(pkg.hasSome('react')).toBeFalsy();
        expect(pkg.hasSome('webpack', 'execa')).toBeTruthy();
        expect(pkg.hasSome('eslint')).toBeTruthy();
    });
    test('hasAll', () => {
        expect(pkg.hasAll('react')).toBeFalsy();
        expect(pkg.hasAll('some-module', 'execa')).toBeFalsy();
        expect(pkg.hasAll('chalk', 'execa')).toBeTruthy();
        // expect(pkg.hasAll('chalk', 'execa', '@babel/cli')).toBeTruthy();
        expect(pkg.hasAll('eslint')).toBeTruthy();
    });
});
/**
 * Verify ESLint module editor can create and edit an ESLint configuration file
 * @test {EslintConfigModuleEditor}
 */
describe('.eslintrc.js mem-fs editor', () => {
    let cfg;
    beforeEach(() => {
        cfg = new EslintConfigModuleEditor(testDirectory);
    });
    test('create', async () => {
        cfg = new EslintConfigModuleEditor('/some/directory');
        expect(cfg.read()).toEqual('');
        await cfg.create();
        expect(cfg.read()).toMatchSnapshot();
    });
    test('read', () => {
        expect(cfg.read()).toMatchSnapshot();
    });
    test('extend', async () => {
        expect(cfg.read()).toMatchSnapshot();
        await cfg.extend({key: {foo: `'foo'`}});
        expect(cfg.read()).toMatchSnapshot();
        await cfg.extend({key: {bar: `'bar'`}});
        expect(cfg.read()).toMatchSnapshot();
    });
    test('delete', async () => {
        cfg = new EslintConfigModuleEditor('/some/directory');
        expect(cfg.read()).toEqual('');
        await cfg.create();
        expect(cfg.read()).toMatchSnapshot();
        await cfg.delete();
        expect(cfg.read()).toEqual('');
    });
    test('prepend', async () => {
        await cfg.prepend(`const {existsSync} = require('fs-extra');`);
        expect(cfg.read()).toMatchSnapshot();
        await cfg.prepend(`const {join} = require('path');`);
        expect(cfg.read()).toMatchSnapshot();
        await cfg.extend({key: {baz: 'baz'}});
        expect(cfg.read()).toMatchSnapshot();
    });
});
describe('Makefile editor', () => {
    let makefile;
    const read = makefile => {
        const [, ...rest] = makefile
            .read()
            .replace(/bin := .*\/__tests__/, 'bin := home/user/project/__tests__')
            .split('\n');
        return ['# Makefile created with tomo', ...rest].join('\n');
    };
    beforeEach(() => {
        makefile = new MakefileEditor(testDirectory);
    });
    test('create', async () => {
        await makefile.create();
        expect(read(makefile)).toMatchSnapshot();
    });
    test('append', async () => {
        await makefile.append('test line');
        expect(read(makefile)).toMatchSnapshot();
    });
    test('addTask', async () => {
        await makefile
            .addTask('foo', 'echo foo')
            .addTask('bar', 'echo bar')
            .done();
        expect(read(makefile)).toMatchSnapshot();
    });
    test('addComment', async () => {
        await makefile.addComment('Knowledge of the Holy One is understanding');
        expect(read(makefile)).toMatchSnapshot();
    });
    test('importScripts', () => {
        expect(makefile.scripts).toMatchSnapshot();
        makefile.importScripts();
        expect(makefile.scripts).toMatchSnapshot();
    });
    test('appendScripts (no bin variable)', async () => {
        makefile = new MakefileEditor(join(testDirectory, 'other-directory'));
        await makefile
            .importScripts()
            .appendScripts()
            .done();
        expect(read(makefile)).toMatchSnapshot();
    });
    test('appendScripts (with bin variable)', async () => {
        await makefile
            .importScripts()
            .appendScripts()
            .done();
        expect(read(makefile)).toMatchSnapshot();
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
    test('format response from npm (only allow valid version strings)', async () => {
        const stdout = '1.0.0 ,\n 2.0.0 ,\n not valid ,\n 3.0.0 ';
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
