import React from 'react';
import {render} from 'ink-testing-library';
import Tomo, {Warning, Task, TaskList} from '../src/ui';

const ARROW_DOWN = '\u001B[B';

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
