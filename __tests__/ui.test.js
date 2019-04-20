import Queue from 'p-queue';
import React from 'react';
import {render} from 'ink-testing-library';
import Tomo, {Warning, Task, TaskList, populateQueue} from '../src/ui';

const ARROW_DOWN = '\u001B[B';

describe('populateQueue function', () => {
    test('can run with defaults', () => {
        populateQueue();
    });
    test('can run tasks with options and dispatch task results', async () => {
        const condition = async () => true;
        const task = jest.fn();
        const options = {foo: 'bar'};
        const dispatch = jest.fn();
        const tasks = [
            {condition, task},
            {condition, task},
            {condition, task}
        ];
        const queue = new Queue({concurrency: tasks.length});
        await populateQueue({queue, tasks, dispatch, options});
        expect(task.mock.calls.length).toBe(tasks.length);
        expect(dispatch.mock.calls.length).toBe(tasks.length);
        const [passedOptions] = [...new Set(task.mock.calls.map(val => val[0]))];
        expect(passedOptions).toBe(options);
        expect(dispatch.mock.calls).toMatchSnapshot();
    });
    test('can only run tasks that pass condition', async () => {
        const task = jest.fn();
        const options = {foo: 'bar'};
        const dispatch = jest.fn();
        const tasks = [
            {condition: async () => true, task},
            {condition: async () => false, task},
            {condition: async () => true, task},
            {condition: async () => false, task}
        ];
        const queue = new Queue({concurrency: tasks.length});
        await populateQueue({queue, tasks, dispatch, options});
        const [passedOptions] = [...new Set(task.mock.calls.map(val => val[0]))];
        expect(passedOptions).toBe(options);
        expect(task.mock.calls.length).toBe(2);
        expect(dispatch.mock.calls).toMatchSnapshot();
    });
    test('can catch task errors', async () => {
        const task = jest.fn();
        const options = {foo: 'bar'};
        const dispatch = jest.fn();
        const tasks = [
            {condition: async () => true, task},
            {condition: async () => {throw new Error();}, task},
            {condition: async () => true, task},
            {condition: async () => false, task}
        ];
        const queue = new Queue({concurrency: tasks.length});
        await populateQueue({queue, tasks, dispatch, options});
        expect(task.mock.calls.length).toBe(2);
        expect(dispatch.mock.calls[1][0].type).toBe('error');
    });
});
describe('Task component', () => {
    test('can render', () => {
        const text = 'test task text';
        const component = render(<Task text={text}></Task>);
        expect(component.lastFrame()).toMatchSnapshot();
    });
    test('can render (completed)', () => {
        const text = 'test task text';
        const {lastFrame} = render(<Task text={text} isComplete={true}></Task>);
        expect(lastFrame()).toMatchSnapshot();
    });
    test('can render with defaults', () => {
        const {lastFrame} = render(<Task isComplete={true}></Task>);
        expect(lastFrame()).toMatchSnapshot();
    });
});
describe('TaskList component', () => {
    test('can render', () => {
        const options = {skipInstall: true};
        const {lastFrame} = render(<TaskList command={'add'} terms={['eslint']} options={options}></TaskList>);
        expect(lastFrame()).toMatchSnapshot();
    });
});
describe('Warning', () => {
    test('can render', () => {
        const callback = jest.fn();
        const {lastFrame} = render(<Warning callback={callback}>Hello World</Warning>);
        expect(lastFrame()).toMatchSnapshot();
    });
});
describe('tomo', () => {
    test('add', () => {
        const input = ['add'];
        const {lastFrame, stdin} = render(<Tomo input={input}/>);
        expect(lastFrame()).toMatchSnapshot();
        stdin.write(ARROW_DOWN);
        expect(lastFrame()).toMatchSnapshot();
    });
    test('add eslint', () => {
        const input = ['add', 'eslint'];
        const {lastFrame} = render(<Tomo input={input}/>);
        expect(lastFrame()).toMatchSnapshot();
    });
    test('add eslint --use-react', () => {
        const input = ['add', 'eslint'];
        const flags = {useReact: true};
        const {lastFrame} = render(<Tomo input={input} flags={flags}/>);
        expect(lastFrame()).toMatchSnapshot();
    });
});
