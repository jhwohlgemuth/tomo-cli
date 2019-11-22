import {getDirectoryTree, useTemporaryDirectory} from './tomo-test';
import Queue from 'p-queue';
import React from 'react';
import {render} from 'ink-testing-library';
import {populateQueue} from '../src/api';
import {CommandError, Warning, Task} from '../src/components';

const {assign} = Object;

jest.mock('is-online', () => (async () => true));

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
            {condition, task, text: `${text}1`},
            {condition, task, text: `${text}2`},
            {condition, task, text: `${text}3`}
        ];
        const queue = new Queue({concurrency: tasks.length});
        await populateQueue({queue, tasks, dispatch, options});
        expect(task.mock.calls.length).toBe(3);
        expect(dispatch.mock.calls.length).toBe(4);// eslint-disable-line no-magic-numbers
        const [passedOptions] = [...new Set(task.mock.calls.map(val => val[0]))];
        expect(passedOptions).toEqual(assign(options, customOptions, {isNotOffline: true}));
        expect(dispatch.mock.calls).toMatchSnapshot();
    });
    test('dedupes tasks based on text value', async () => {
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
        expect(task.mock.calls.length).toBe(1);
        expect(dispatch.mock.calls.length).toBe(2);// eslint-disable-line no-magic-numbers
        const [passedOptions] = [...new Set(task.mock.calls.map(val => val[0]))];
        expect(passedOptions).toEqual(assign(options, customOptions, {isNotOffline: true}));
        expect(dispatch.mock.calls).toMatchSnapshot();
    });
    test('can only run tasks that pass condition', async () => {
        const task = jest.fn();
        const options = {foo: 'bar'};
        const dispatch = jest.fn();
        const tasks = [
            {condition: async () => true, task, text: `${text}1`},
            {condition: async () => false, task, text: `${text}2`},
            {condition: async () => true, task, text: `${text}3`},
            {condition: async () => false, task, text: `${text}4`}
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
            {text: `${text}1`, condition: async () => true, task},
            {text: `${text}2`, condition: async () => {throw new Error();}, task},
            {text: `${text}3`, condition: async () => true, task},
            {text: `${text}4`, condition: async () => false, task}
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
