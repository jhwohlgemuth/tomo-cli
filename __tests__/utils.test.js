import {join} from 'path';
import sinon from 'sinon';
import execa from 'execa';
import {readMakefile as read, useTemporaryDirectory} from './tomo-test';
import commands from '../src/commands';
import {
    EslintConfigModuleEditor,
    MakefileEditor,
    PackageJsonEditor,
    choose,
    createFunctionModuleEditor,
    getElapsedSeconds,
    getElapsedTime,
    getIntendedInput,
    getVersions,
    install,
    uninstall,
    withOptions
} from '../src/api';

jest.mock('execa');

const testDirectory = join(__dirname, 'tomo-fixtures');
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
    let tempDirectory;
    const [setTempDir, cleanupTempDir] = useTemporaryDirectory();
    beforeEach(async () => {
        tempDirectory = await setTempDir();
        process.chdir(tempDirectory);
        cfg = new EslintConfigModuleEditor(testDirectory);
    });
    afterEach(async () => {
        await cleanupTempDir();
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
        expect(await cfg.read()).toMatchSnapshot();
        await cfg.extend({key: {foo: `'foo'`}});
        expect(await cfg.read()).toMatchSnapshot();
        await cfg.extend({key: {bar: `'bar'`}});
        expect(await cfg.read()).toMatchSnapshot();
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
            .addTask('foo', ['echo foo'], {description: 'Foo task'})
            .addTask('bar', ['echo bar'], {description: 'Bar task'})
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
describe('createFunctionModuleEditor', () => {
    const content = {foo: `'bar'`};
    test('can create function module (defaults)', async () => {
        const Module = createFunctionModuleEditor('webpack.config.js', content);
        expect(await (new Module()).create().read()).toMatchSnapshot();
    });
    test('can create function module with passed parameters', async () => {
        const params = ['foo', 'bar'];
        const Module = createFunctionModuleEditor('webpack.config.js', content, {params});
        expect(await (new Module()).create().read()).toMatchSnapshot();
    });
    test('can create function module with passed []', async () => {
        const params = [];
        const Module = createFunctionModuleEditor('webpack.config.js', content, {params});
        expect(await (new Module()).create().read()).toMatchSnapshot();
    });
    test('can create function ES module (defaults)', async () => {
        const esm = true;
        const Module = createFunctionModuleEditor('webpack.config.js', content, {esm});
        expect(await (new Module()).create().read()).toMatchSnapshot();
    });
    test('can create function ES module with passed parameters', async () => {
        const esm = true;
        const params = ['foo', 'bar'];
        const Module = createFunctionModuleEditor('webpack.config.js', content, {esm, params});
        expect(await (new Module()).create().read()).toMatchSnapshot();
    });
    test('can create function ES module with passed []', async () => {
        const esm = true;
        const params = [];
        const Module = createFunctionModuleEditor('webpack.config.js', content, {esm, params});
        expect(await (new Module()).create().read()).toMatchSnapshot();
    });
});
describe('choose via options', () => {
    test('with and without default options', () => {
        const withoutDefault = {
            a: ['a', 'aa', 'aaa'],
            b: ['b', 'bb', 'bbb'],
            c: ['c', 'cc', 'ccc']
        };
        const withDefault = {
            a: ['a', 'aa', 'aaa'],
            b: ['b', 'bb', 'bbb'],
            c: ['c', 'cc', 'ccc'],
            default: [0, 0, 0]
        };
        expect(choose(withoutDefault)({d: true})).toEqual(withoutDefault.a);
        expect(choose(withDefault)({d: true})).toEqual(withDefault.default);
        expect(choose(withDefault)({b: true})).toEqual(withDefault.b);
        expect(choose(withDefault)({b: true, c: true})).toEqual(withDefault.b);
        expect(choose(withDefault)({a: false, c: true})).toEqual(withDefault.c);
    });
});
describe('getElapsedTime', () => {
    const second = 1000;
    const minute = 60 * second; // eslint-disable-line no-magic-numbers
    const clock = sinon.useFakeTimers();
    afterAll(() => {
        clock.restore();
    });
    test('can count seconds', () => {
        const [start] = process.hrtime();
        expect(getElapsedTime(start)).toEqual('00:00:00');
        clock.tick(second);
        expect(getElapsedTime(start)).toEqual('00:00:01');
        clock.tick(second);
        expect(getElapsedTime(start)).toEqual('00:00:02');
    });
    test('can update minutes using modular arithmetic', () => {
        const [start] = process.hrtime();
        expect(getElapsedTime(start)).toEqual('00:00:00');
        clock.tick(59 * second); // eslint-disable-line no-magic-numbers
        expect(getElapsedTime(start)).toEqual('00:00:59');
        clock.tick(2 * second);
        expect(getElapsedTime(start)).toEqual('00:01:01');
    });
    test('can update hours using modular arithmetic', () => {
        const [start] = process.hrtime();
        expect(getElapsedTime(start)).toEqual('00:00:00');
        clock.tick(59 * minute); // eslint-disable-line no-magic-numbers
        expect(getElapsedTime(start)).toEqual('00:59:00');
        clock.tick(2 * minute);
        expect(getElapsedTime(start)).toEqual('01:01:00');
    });
});
describe('getElapsedSeconds', () => {
    test('can convert durations to seconds', () => {
        expect(getElapsedSeconds('00:00:15')).toEqual(15);
        expect(getElapsedSeconds('00:00:59')).toEqual(59);
        expect(getElapsedSeconds('00:01:59')).toEqual(119);
        expect(getElapsedSeconds('00:25:03')).toEqual(1503);
        expect(getElapsedSeconds('10:05:45')).toEqual(36345);
    });
});
describe('getIntendedInput', () => {
    test('return closest matches', () => {
        const {intendedCommand, intendedTerms} = getIntendedInput(commands, 'ad', ['lint']);
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
    const latest = true;
    const skipInstall = true;
    const dev = true;
    test('handle array of string names', async () => {
        expect(await install()).toEqual(['install']);
        expect(await install(['some-module'])).toEqual(['install', 'some-module@latest']);
        expect(await install(['some-module'])).toEqual(['install', 'some-module@latest']);
        expect(await install(['some-module'], {latest: false, skipInstall})).toEqual(['install', 'some-module']);
        expect(await install(['foo', 'bar'], {latest: false, skipInstall})).toEqual(['install', 'foo', 'bar']);
        expect(await install(['some-module'], {dev, skipInstall})).toEqual(['install', 'some-module', '--save-dev']);
        expect(await install(['some-module'], {dev, latest, skipInstall})).toEqual(['install', 'some-module@latest', '--save-dev']);
        expect(await install(['foo', 'bar'], {latest: false, dev, skipInstall})).toEqual(['install', 'foo', 'bar', '--save-dev']);
    });
    test('only allow valid module names', async () => {
        const INVALID_NAME = 'eLaBorAtE-paCkAgE-with-mixed-case';
        expect(await install([INVALID_NAME])).toEqual(['install']);
        expect(await install(['jest', INVALID_NAME])).toEqual(['install', 'jest@latest']);
    });
});
describe('uninstall', () => {
    test('handle array of string names', async () => {
        expect(await uninstall()).toEqual(['uninstall']);
        expect(await uninstall(['some-module'])).toEqual(['uninstall', 'some-module']);
        expect(await uninstall(['some-module', 'foo', 'bar'])).toEqual(['uninstall', 'some-module', 'foo', 'bar']);
    });
    test('only allow valid module names', async () => {
        const INVALID_NAME = 'eLaBorAtE-paCkAgE-with-mixed-case';
        expect(await uninstall([INVALID_NAME])).toEqual(['uninstall']);
        expect(await uninstall(['jest', INVALID_NAME])).toEqual(['uninstall', 'jest']);
    });
});
describe('withOptions', () => {
    test('add custom options', () => {
        const options = {a: 1, b: 2};
        expect(withOptions({a: 0, c: 1})(options)).toMatchSnapshot();
    });
});