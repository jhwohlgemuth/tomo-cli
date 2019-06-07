import {getDirectoryTree, useTemporaryDirectory} from './tomo-test';
import Queue from 'p-queue';
import React from 'react';
import {render} from 'ink-testing-library';
import Tomo, {CommandError, Warning, Task, populateQueue} from '../src/ui';

jest.mock('is-online', () => (async () => true));

const ARROW_DOWN = '\u001B[B';
const {assign} = Object;

describe('populateQueue function', () => {
    const text = 'test task text';
    test('can run with defaults', () => {
        populateQueue();
    });
    test('can run tasks with options and dispatch task results', async () => {
        const condition = async () => true;
        const task = jest.fn();
        const options = {foo: 'bar'};
        const customOptions = {some: 'option'};
        const dispatch = jest.fn();
        const tasks = [
            {some: 'option'},
            {condition, task, text},
            {condition, task, text},
            {condition, task, text}
        ];
        const queue = new Queue({concurrency: tasks.length});
        await populateQueue({queue, tasks, dispatch, options});
        expect(task.mock.calls.length).toBe(3);
        expect(dispatch.mock.calls.length).toBe(4);// eslint-disable-line no-magic-numbers
        const [passedOptions] = [...new Set(task.mock.calls.map(val => val[0]))];
        expect(passedOptions).toEqual(assign(options, customOptions, {isNotOffline: true}));
        expect(dispatch.mock.calls).toMatchSnapshot();
    });
    test('can only run tasks that pass condition', async () => {
        const task = jest.fn();
        const options = {foo: 'bar'};
        const dispatch = jest.fn();
        const tasks = [
            {condition: async () => true, task, text},
            {condition: async () => false, task, text},
            {condition: async () => true, task, text},
            {condition: async () => false, task, text}
        ];
        const queue = new Queue({concurrency: tasks.length});
        await populateQueue({queue, tasks, dispatch, options});
        const [passedOptions] = [...new Set(task.mock.calls.map(val => val[0]))];
        expect(passedOptions).toMatchSnapshot();
        expect(task.mock.calls.length).toBe(2);
        expect(dispatch.mock.calls).toMatchSnapshot();
    });
    test('can catch task errors', async () => {
        const task = jest.fn();
        const options = {foo: 'bar'};
        const dispatch = jest.fn();
        const tasks = [
            {text, condition: async () => true, task},
            {text, condition: async () => {throw new Error();}, task},
            {text, condition: async () => true, task},
            {text, condition: async () => false, task}
        ];
        const queue = new Queue({concurrency: tasks.length});
        await populateQueue({queue, tasks, dispatch, options});
        expect(task.mock.calls.length).toBe(2);
        expect(dispatch.mock.calls[2][0].type).toBe('error');
    });
});
describe('Warning', () => {
    test('can render', () => {
        const callback = jest.fn();
        const {lastFrame} = render(<Warning callback={callback}>Hello World</Warning>);
        expect(lastFrame()).toMatchSnapshot();
    });
});
describe('CommandError', () => {
    let tempDirectory;
    const [setTempDir, cleanupTempDir] = useTemporaryDirectory();
    beforeEach(async () => {
        tempDirectory = await setTempDir();
        process.chdir(tempDirectory);
    });
    afterEach(async () => {
        await cleanupTempDir();
    });
    test('can render component and create errors file', () => {
        const errors = [{one: 1}, {two: 2}];
        const {lastFrame} = render(<CommandError errors={errors}></CommandError>);
        const tree = getDirectoryTree(tempDirectory);
        expect(tree).toMatchSnapshot();
        expect(lastFrame()).toMatchSnapshot();
    });
});
describe('Task component', () => {
    test('can render (pending)', () => {
        const text = 'test task text';
        const {lastFrame} = render(<Task text={text} isPending={true}></Task>);
        expect(lastFrame()).toMatchSnapshot();
    });
    test('can render (completed)', () => {
        const text = 'test task text';
        const {lastFrame} = render(<Task text={text} isComplete={true}></Task>);
        expect(lastFrame()).toMatchSnapshot();
    });
    test('can render (skipped)', () => {
        const text = 'test task text';
        const {lastFrame} = render(<Task text={text} isComplete={true} isSkipped={true}></Task>);
        expect(lastFrame()).toMatchSnapshot();
    });
    test('can render (errored)', () => {
        const text = 'test task text';
        const {lastFrame} = render(<Task text={text} isErrored={true}></Task>);
        expect(lastFrame()).toMatchSnapshot();
    });
    test('can render with default text', () => {
        const {lastFrame} = render(<Task isComplete={true}></Task>);
        expect(lastFrame()).toMatchSnapshot();
    });
});
describe('tomo', () => {
    let tempDirectory;
    const skipInstall = true;
    const [setTempDir, cleanupTempDir] = useTemporaryDirectory();
    const ORIGINAL_CONSOLE_ERROR = console.error;//eslint-disable-line no-console
    beforeAll(() => {
        console.error = jest.fn();//eslint-disable-line no-console
    });
    afterAll(() => {
        console.error = ORIGINAL_CONSOLE_ERROR;//eslint-disable-line no-console
    });
    beforeEach(async () => {
        tempDirectory = await setTempDir();
        process.chdir(tempDirectory);
    });
    afterEach(async () => {
        await cleanupTempDir();
    });
    test('add', () => {
        const input = ['add'];
        const {lastFrame, stdin} = render(<Tomo input={input} flags={{skipInstall}}/>);
        expect(lastFrame()).toMatchSnapshot();
        stdin.write(ARROW_DOWN);
        expect(lastFrame()).toMatchSnapshot();
    });
    test('remove', () => {
        const input = ['remove'];
        const {lastFrame, stdin} = render(<Tomo input={input} flags={{skipInstall}} />);
        expect(lastFrame()).toMatchSnapshot();
        stdin.write(ARROW_DOWN);
        expect(lastFrame()).toMatchSnapshot();
    });
    xtest('add eslint', done => {
        const input = ['add', 'eslint'];
        const flags = {skipInstall};
        const {lastFrame} = render(<Tomo input={input} flags={flags} done={complete}/>);
        function complete() {
            expect(lastFrame()).toMatchSnapshot();
            done();
        }
    });
    xtest('add eslint --use-react', done => {
        const input = ['add', 'eslint'];
        const flags = {useReact: true, skipInstall};
        const {lastFrame} = render(<Tomo input={input} flags={flags} done={complete}/>);
        function complete() {
            expect(lastFrame()).toMatchSnapshot();
            done();
        }
    });
});
