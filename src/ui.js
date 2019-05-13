import React, {useContext, useEffect, useReducer, useState} from 'react';
import PropTypes from 'prop-types';
import {isFunction, isString, isUndefined} from 'lodash';
import {bold, dim} from 'chalk';
import Queue from 'p-queue';
import isOnline from 'is-online';
import {Box, Color, StdinContext, Text} from 'ink';
import {default as InkBox} from 'ink-box';
import Spinner from 'ink-spinner';
import SelectInput from 'ink-select-input';
import figures from 'figures';
import commands from './commands';
import {getIntendedInput} from './utils';
const pino = require('pino');

const {assign, entries} = Object;
const dict = val => new Map(entries(val));
const space = ' ';
const Check = ({isSkipped}) => <Color bold green={!isSkipped} dim={isSkipped}>{figures.tick}{space}</Color>;
const X = () => <Color bold red>{figures.cross}{space}</Color>;
const Pending = () => <Color cyan><Spinner></Spinner>{space}</Color>;
const Item = ({isSelected, label}) => <Color bold={isSelected} cyan={isSelected}>{label}</Color>;
const Indicator = ({isSelected}) => <Box marginRight={1}>{isSelected ? <Color bold cyan>{figures.arrowRight}</Color> : ' '}</Box>;
const Description = ({command}) => {
    const getDescription = item => {
        const DEFAULT = `${dim('Sorry, I don\'t have anything to say about')} ${item}`;
        const lookup = dict({
            project: `Scaffold a new Node.js project with ${bold.yellow('Babel')}, ${bold.cyan('ESLint')}, and ${bold.magenta('Jest')}`,
            app: `Scaffold a new ${bold.red('Marionette.js')} ${bold.cyan('web application')} - basically a project with CSS, bundling, and stuff`,
            server: `Scaffold a new Express server with security baked in - ${bold.yellow('WORK IN PROGRESS')}`,
            a11y: `Add automated ${bold.cyan('accessibility')} testing`,
            babel: `Use next generation JavaScript, ${bold.cyan('today!')}`,
            esdoc: `Generate ${bold.cyan('documentation')} from your comments`,
            eslint: `Pluggable ${bold.cyan('linting')} utility for JavaScript and JSX`,
            jest: `Delightful JavaScript ${bold.cyan('Testing')} Framework with a focus on simplicity`,
            makefile: `Create a ${bold.cyan('Makefile')} from your package.json, like ${bold.magenta('magic!')}`,
            postcss: `Use ${bold.cyan('future CSS')}, never write vendor prefixes again, and much much more!`,
            webpack: `${bold.cyan('Bundle')} your assets`
        });
        return lookup.has(item) ? lookup.get(item) : DEFAULT;
    };
    return <Box marginBottom={1}>
        <Color cyan>{getDescription(command)}</Color>
    </Box>;
};
const SubCommandSelect = ({items, onSelect}) => {
    const [highlighted, setHighlighted] = useState(items[0].value);
    const onHighlight = item => {
        setHighlighted(item.value);
    };
    return <Box flexDirection={'column'} paddingTop={1} paddingBottom={1} paddingLeft={1}>
        <Description command={highlighted}></Description>
        <SelectInput
            items={items}
            onSelect={onSelect}
            onHighlight={onHighlight}
            itemComponent={Item}
            indicatorComponent={Indicator}
        ></SelectInput>
    </Box>;
};
const UnderConstruction = () => <Box marginBottom={1}>
    <InkBox padding={{left: 1, right: 1}} margin={{left: 1, top: 1}}>
        <Color bold yellow>UNDER CONSTRUCTION</Color>
    </InkBox>
</Box>;
const ErrorMessage = ({info}) => <Box flexDirection={'column'} marginBottom={1}>
    <InkBox borderColor={'yellow'} margin={{left: 1, top: 1}} padding={{left: 1, right: 1}}>
        <Color yellow>(╯°□ °)╯ ┻━┻ arrrgh...</Color>
    </InkBox>
    <Box marginLeft={4}>
        ↳ <Color dim>Something went wrong...</Color>
    </Box>
    <Box marginLeft={6} marginTop={1}>
        <Color dim><Box>{info}</Box></Color>
    </Box>
</Box>;
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            info: '',
            error: {},
            hasError: false
        };
    }
    static getDerivedStateFromError() {
        return {hasError: true};
    }
    componentDidCatch(error, info) {
        this.setState({error, info});
    }
    render() {
        const {error, hasError} = this.state;
        const {children} = this.props;
        return hasError ? <ErrorMessage error={error}/> : children;
    }
}
/**
 * Component to display warning message requiring user input
 * @param {Object} props Function component props
 * @param {ReactNode} props.children Function component children
 * @param {function} props.callback Function to be called after user interacts with warning
 * @return {ReactComponent} Warning component
 */
export const Warning = ({callback, children}) => {
    const {setRawMode, stdin} = useContext(StdinContext);
    useEffect(() => {
        setRawMode && setRawMode(true);
        stdin.on('data', callback);
        return function cleanup() {
            stdin.removeListener('data', callback);
            setRawMode && setRawMode(false);
        };
    });
    return <Box flexDirection={'column'} marginBottom={1}>
        <InkBox borderColor={'yellow'} margin={{left: 1, top: 1}} padding={{left: 1, right: 1}}>
            <Color yellow>oops...</Color>
        </InkBox>
        <Box marginLeft={4}>
            ↳ {children}
        </Box>
        <Box marginLeft={6} marginTop={1}>
            <Color dim>Press </Color><Text bold>ENTER</Text><Color dim> to continue</Color>
        </Box>
    </Box>;
};
export const OfflineWarning = () => <Box flexDirection={'column'} marginBottom={1}>
    <InkBox borderColor={'yellow'} margin={{left: 1, top: 1}} padding={{left: 1, right: 1}}>
        <Color yellow>(⌒_⌒;) This is awkward...</Color>
    </InkBox>
    <Box marginLeft={4} flexDirection={'column'}>
        <Box>↳ <Text>...but you appear to be <Color bold red>offline</Color></Text></Box>
        <Box>↳ <Text>Please connect to the internet and <Color bold cyan>try again</Color></Text></Box>
    </Box>
    <Box marginLeft={6} marginTop={1}>
        <Color dim>No dependencies were installed</Color>
    </Box>
</Box>;
export const CommandError = errors => {
    const log = pino(
        {prettyPrint: {levelFirst: true}},
        pino.destination('./tomo-errors.txt')
    );
    useEffect(() => {
        log.error(errors);
    }, []);
    return <Box flexDirection={'column'} marginTop={1} marginLeft={1}>
        <Box><X/><Text>Something has gone horribly <Color bold red>wrong</Color></Text></Box>
        <Box marginLeft={2}>↳{space}<Color dim>Details written to ./tomo-errors.txt</Color></Box>
    </Box>;
};
/**
 * Add async tasks to a queue, handle completion with actions dispatched via dispatch function
 * @param {Object} data Data to be used for populating queue
 * @param {Queue} [data.queue={}] p-queue instance
 * @param {Object[]} [data.tasks=[]] Array of task objects
 * @param {function} [data.dispatch=()=>{}] Function to dispatch task completion (complete, skip, error) actions
 * @param {Object} [data.options={}] Options object to pass to task function
 * @return {undefined} Returns nothing (side effects only)
 */
export async function populateQueue(data = {queue: {}, tasks: [], dispatch: () => {}, options: {skipInstall: false}}) {
    const {queue, tasks, dispatch, options} = data;
    const {skipInstall} = options;
    const isNotOffline = skipInstall || await isOnline();
    dispatch({type: 'status', payload: isNotOffline ? 'online' : 'offline'});
    for (const [index, item] of tasks.entries()) {
        const {condition, task} = item;
        try {
            if (await condition({...options, isNotOffline})) {
                await queue
                    .add(() => task({...options, isNotOffline}))
                    .then(() => dispatch({type: 'complete', payload: index}))
                    .catch(() => dispatch({
                        type: 'error', payload: {
                            index,
                            title: 'Failed to add task to queue',
                            location: 'task',
                            details: item.text
                        }
                    }));
            } else {
                dispatch({type: 'skipped', payload: index});
            }
        } catch (error) {
            dispatch({
                type: 'error',
                payload: {
                    error,
                    index,
                    title: 'Failed to test task conditions',
                    location: 'condition',
                    details: item.text
                }
            });
        }
    }
}
/**
 * Task component
 * @param {Object} props Function component props
 * @param {boolean} props.isComplete Control display of check (true) or loading (false)
 * @param {boolean} props.isErrored Control display of x (true)
 * @param {boolean} props.isSkipped Control color of check - green (false) or dim (true)
 * @param {string} props.text Task text
 * @example
 * <Task text={'This task is done before it starts'} isComplete={true}></Task>
 * @return {ReactComponent} Task component
 */
export const Task = ({isComplete, isErrored, isPending, isSkipped, text}) => <Box flexDirection='row' marginLeft={3}>
    {isComplete && <Check isSkipped={isSkipped}></Check>}
    {isErrored && <X/>}
    {isPending && <Pending/>}
    <Text><Color dim={isComplete}>{text}</Color></Text>
</Box>;
/**
 * Task list component
 * @param {Object} props Function component props
 * @param {string} props.command Command - new | create | add
 * @param {Object} props.options Command line flags (see help)
 * @param {string[]} props.terms Terms - eslint | babel | jest | postcss | docs
 * @example
 * <TaskList command={'add'} terms={'eslint'} options={{skipInstall: true}}></TaskList>
 * @return {ReactComponent} Task list component
 */
export const TaskList = ({command, options, terms, done}) => {
    const reducer = (state, {type, payload}) => {
        const {completed, errors, skipped} = state;
        const update = val => assign({}, state, val);
        const lookup = dict({
            complete: () => update({completed: [...completed, payload]}),
            skipped: () => update({skipped: [...skipped, payload]}),
            error: () => update({errors: [...errors, {payload}]}),
            status: () => update({status: payload})
        });
        return lookup.has(type) ? lookup.get(type)() : state;
    };
    const initialState = {
        completed: [],
        skipped: [],
        errors: [],
        status: 'online'
    };
    const [state, dispatch] = useReducer(reducer, initialState);
    const {completed, errors, skipped, status} = state;
    const queue = new Queue({concurrency: 1});
    const tasks = commands[command][terms[0]];
    // const tasks = terms.map(term => commands[command][term]).flat(1);
    const tasksComplete = ((completed.length + skipped.length) === tasks.length);
    const hasError = (errors.length > 0);
    const {skipInstall} = options;
    useEffect(() => {
        populateQueue({queue, tasks, options, dispatch});
    }, [tasks]);
    tasksComplete && isFunction(done) && done();
    return <ErrorBoundary>
        {status === 'offline' && !skipInstall && <OfflineWarning/>}
        {hasError && <CommandError errors={errors}></CommandError>}
        <Box flexDirection={'column'} marginBottom={1}>
            <InkBox
                margin={{left: 1, top: 1}}
                padding={{left: 1, right: 1}}
                borderColor={tasksComplete ? 'green' : (hasError ? 'red' : 'cyan')}
                borderStyle={'round'}>
                <Color bold white>{command} {terms.join(' ')}</Color>
            </InkBox>
            <Box flexDirection='column' marginBottom={1}>
                {tasks.map(({optional, text}, index) => {
                    const {completed, errors, skipped} = state;
                    const isSkipped = skipped.includes(index);
                    const isComplete = completed.includes(index) || isSkipped;
                    const isErrored = errors.map(error => error.payload.index).includes(index);
                    const isPending = [isComplete, isSkipped, isErrored].every(val => !val);
                    const shouldBeShown = isUndefined(optional) || (isFunction(optional) && optional(options));
                    return shouldBeShown ?
                        <Task
                            text={text}
                            isSkipped={isSkipped}
                            isComplete={isComplete}
                            isErrored={isErrored}
                            isPending={isPending}
                            key={index}>
                        </Task> :
                        <Box key={index}></Box>;
                })}
            </Box>
        </Box>
    </ErrorBoundary>;
};
/**
 * Main tomo UI component
 * @param {Object} props Component props
 * @return {ReactComponent} Main tomo UI component
 */
class UI extends React.Component {
    constructor(props) {
        super(props);
        const {flags, input} = props;
        const {ignoreWarnings} = flags;
        const [command, ...terms] = input;
        const hasCommand = isString(command);
        const hasTerms = terms.length > 0;
        const {intendedCommand, intendedTerms} = hasCommand ? getIntendedInput(commands, command, terms) : {};
        const compare = (term, index) => (term !== terms[index]);
        const showWarning = ((command !== intendedCommand) || intendedTerms.map(compare).some(Boolean)) && !ignoreWarnings;
        this.state = {
            hasTerms,
            hasCommand,
            showWarning,
            intendedTerms,
            intendedCommand
        };
        this.updateWarning = this.updateWarning.bind(this);
        this.updateTerms = this.updateTerms.bind(this);
    }
    render() {
        const {done, flags} = this.props;
        const {hasCommand, hasTerms, intendedCommand, intendedTerms, showWarning} = this.state;
        const VALID_COMMANDS = hasCommand ? Object.keys(commands[intendedCommand]) : [];
        const selectInputCommandItems = hasCommand ? VALID_COMMANDS.map(command => ({label: command, value: command})) : [];
        return <ErrorBoundary>
            {showWarning ?
                <Warning callback={this.updateWarning}>
                    <Text>Did you mean <Color bold green>{intendedCommand} {intendedTerms.join(' ')}</Color>?</Text>
                </Warning> :
                (hasCommand && hasTerms) ?
                    <TaskList command={intendedCommand} terms={intendedTerms} options={flags} done={done}></TaskList> :
                    hasCommand ?
                        <SubCommandSelect items={selectInputCommandItems} onSelect={this.updateTerms}></SubCommandSelect> :
                        <UnderConstruction />
            }
        </ErrorBoundary>;
    }
    /**
     * Callback function for warning component
     * @param {string} data Character data from stdin
     * @return {undefined} Returns nothing
     */
    updateWarning(data) {
        const key = String(data);
        (key === '\r') ? this.setState({showWarning: false}) : process.exit(0);
    }
    /**
     * @param {Object} args Function options
     * @param {string} args.value Intended term
     * @return {undefined} Returns nothing
     */
    updateTerms({value}) {
        this.setState({
            hasTerms: true,
            intendedTerms: [value]
        });
    }
}
Check.propTypes = {
    isSkipped: PropTypes.bool
};
Check.defaultProps = {
    isSkipped: false
};
Description.propTypes = {
    command: PropTypes.string
};
SubCommandSelect.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    onSelect: PropTypes.func
};
Indicator.propTypes = {
    isSelected: PropTypes.bool
};
Indicator.defaultProps = {
    isSelected: false
};
Item.propTypes = {
    isSelected: PropTypes.bool,
    label: PropTypes.string.isRequired
};
Item.defaultProps = {
    isSelected: false
};
ErrorMessage.propTypes = {
    info: PropTypes.string
};
ErrorBoundary.propTypes = {
    children: PropTypes.node
};
Task.propTypes = {
    isComplete: PropTypes.bool,
    isErrored: PropTypes.bool,
    isSkipped: PropTypes.bool,
    isPending: PropTypes.bool,
    text: PropTypes.string
};
Task.defaultProps = {
    isComplete: false,
    isErrored: false,
    isSkipped: false,
    isPending: false,
    text: 'task description'
};
TaskList.propTypes = {
    command: PropTypes.string,
    options: PropTypes.any,
    terms: PropTypes.arrayOf(PropTypes.string),
    done: PropTypes.func
};
TaskList.defaultProps = {
    command: '',
    options: {skipInstall: false},
    terms: []
};
Warning.propTypes = {
    callback: PropTypes.func,
    children: PropTypes.node
};
UI.propTypes = {
    input: PropTypes.array,
    flags: PropTypes.object,
    done: PropTypes.func
};
UI.defaultProps = {
    input: [],
    flags: {}
};
export default UI;
