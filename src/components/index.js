import React, {Component, Fragment, useContext, useEffect, useReducer, useState} from 'react';
import PropTypes from 'prop-types';
import {complement, is} from 'ramda';
import {bold, dim} from 'chalk';
import pino from 'pino';
import {Box, Color, StdinContext, Text} from 'ink';
import {default as InkBox} from 'ink-box';
import Spinner from 'ink-spinner';
import SelectInput from 'ink-select-input';
import MultiSelectInput from 'ink-multi-select';
import figures from 'figures';
import {highlight} from 'cardinal';
import {
    dict,
    format,
    isUniqueTask,
    isValidTask,
    maybeApply,
    populateQueue
} from '../api';
export {default as Main} from './main';

const {assign} = Object;
const space = ' ';
const Check = ({isSkipped}) => <Color bold green={!isSkipped} dim={isSkipped}>{figures.tick}{space}</Color>;
const X = () => <Color bold red>{figures.cross}{space}</Color>;
const Pending = () => <Color cyan><Spinner></Spinner>{space}</Color>;
const Item = ({isHighlighted, isSelected, label}) => <Color bold={isHighlighted || isSelected} cyan={isHighlighted || isSelected}>{label}</Color>;
const Indicator = ({isHighlighted, isSelected}) => <Box marginRight={1}>
    {(isHighlighted || isSelected) ? <Color bold cyan>{figures.arrowRight}</Color> : ' '}
</Box>;
const CheckBox = ({isSelected}) => (
    <Box marginRight={1}>
        <Color cyan>{isSelected ? figures.tick : ' '}</Color>
    </Box>
);
export const CommandError = errors => {
    const log = pino(
        {prettyPrint: {levelFirst: true}},
        pino.destination('./tomo-errors.txt')
    );
    useEffect(() => {
        log.error(errors);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return <Box flexDirection={'column'} marginTop={1} marginLeft={1}>
        <Box><X /><Text>Something has gone horribly <Color bold red>wrong</Color></Text></Box>
        <Box marginLeft={2}>↳{space}<Color dim>Details written to ./tomo-errors.txt</Color></Box>
    </Box>;
};
export const Debug = ({data, title}) => {
    const {completed, errors, skipped, terms, options} = data;
    const formatted = Object.keys(options)
        .filter(key => !is(String)(options[key]))
        .map(key => `${key} - ${options[key]}`)
        .sort();
    const print = value => value |> format |> highlight;
    const DebugValue = ({title = 'value', value}) => <Box>
        <Fragment><Color dim>{title}</Color>: {print(value)}</Fragment>
    </Box>;
    DebugValue.propTypes = {
        value: PropTypes.any
    };
    return <Box flexDirection={'column'} marginTop={1} marginLeft={1}>
        <Box marginBottom={1}>
            <Color bold cyan>DEBUG: </Color><Color bold dim>{title}</Color>
        </Box>
        <DebugValue title={'Terms'} value={terms}></DebugValue>
        <DebugValue title={'Options'} value={formatted}></DebugValue>
        <DebugValue title={'Completed'} value={completed}></DebugValue>
        <DebugValue title={'Skipped'} value={skipped}></DebugValue>
        <DebugValue title={'Errors'} value={errors}></DebugValue>
    </Box>;
};
export const Description = ({command, descriptions}) => {
    const getDescription = item => {
        const DEFAULT = item => `${dim('Sorry, I don\'t have anything to say about')} ${item}`;
        const lookup = dict(descriptions);
        const value = lookup.has(item) ? lookup.get(item) : (lookup.has('default') ? lookup.get('default') : DEFAULT);
        return typeof value === 'function' ? value(item) : value;
    };
    return <Box marginBottom={1}>
        <Color cyan>{getDescription(command)}</Color>
    </Box>;
};
export const ErrorMessage = ({info}) => <Box flexDirection={'column'} marginBottom={1}>
    <InkBox borderColor={'yellow'} margin={{left: 1, top: 1}} padding={{left: 1, right: 1}}>
        <Color yellow>(╯°□ °)╯ ┻━┻ arrrgh...</Color>
    </InkBox>
    <Box marginLeft={4}>
        ↳{space}<Color dim>Something went wrong...</Color>
    </Box>
    <Box marginLeft={6} marginTop={1}>
        <Color dim><Box>{info}</Box></Color>
    </Box>
</Box>;
export class ErrorBoundary extends Component {
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
export const SubCommandSelect = ({command, descriptions, items, onSelect}) => {
    const [highlighted, setHighlighted] = useState(items[0].value);
    const onHighlight = item => {
        setHighlighted(item.value);
    };
    const showWithRemove = `${bold.yellow('CAUTION:')} tomo shall ${bold.red('remove')} that which tomo would have ${bold.green('added')}`;
    return <Box flexDirection={'column'} paddingTop={1} paddingBottom={1} paddingLeft={1}>
        {command === 'remove' ?
            <Box marginBottom={1}>{showWithRemove}</Box> :
            <Description command={highlighted} descriptions={descriptions}></Description>}
        <SelectInput
            items={items}
            onSelect={onSelect}
            onHighlight={onHighlight}
            itemComponent={Item}
            indicatorComponent={Indicator}
        ></SelectInput>
    </Box>;
};
export const SubCommandMultiSelect = ({descriptions, items, onSubmit}) => {
    const [highlighted, setHighlighted] = useState(items[0].value);
    const [selected, setSelected] = useState([]);
    const onHighlight = item => {
        setHighlighted(item.value);
    };
    const onSelect = item => {
        const {value} = item;
        setSelected(selected.concat(value));
    };
    const onUnselect = item => {
        const {value} = item;
        setSelected(selected.filter(item => item !== value));
    };
    return <Box flexDirection={'column'} paddingTop={1} paddingBottom={1} paddingLeft={1}>
        <Box flexDirection="column" marginBottom={1}>
            <Color dim>{selected.length > 0 ?
                `selected ${figures.pointerSmall} ` :
                '...press spacebar to select items'}{selected.sort().join(', ')}
            </Color>
            {selected.length > 0 ? <Color dim> ↳ press ENTER to see suggestions</Color> : <Text> </Text>}
        </Box>
        <Description command={highlighted} descriptions={descriptions}></Description>
        <MultiSelectInput
            items={items}
            onSubmit={onSubmit}
            onSelect={onSelect}
            onUnselect={onUnselect}
            onHighlight={onHighlight}
            itemComponent={Item}
            indicatorComponent={Indicator}
            checkboxComponent={CheckBox}
        ></MultiSelectInput>
    </Box>;
};
export const UnderConstruction = () => <Box marginBottom={1}>
    <InkBox padding={{left: 1, right: 1}} margin={{left: 1, top: 1}}>
        <Color bold yellow>UNDER CONSTRUCTION</Color>
    </InkBox>
</Box>;
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
            ↳{space}{children}
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
        <Box>↳{space}<Text>...you appear to be <Color bold red>offline</Color></Text></Box>
        <Box>↳{space}<Text>Please connect to the internet and <Color bold cyan>try again</Color></Text></Box>
    </Box>
    <Box marginLeft={6} marginTop={1}>
        <Color dim>No dependencies will be installed</Color>
    </Box>
</Box>;
export const Status = ({tasks, completed, skipped}) => {
    const tasksComplete = (completed.length + skipped.length) === tasks.length;
    return <Box flexDirection={'column'}>
        <Box marginLeft={4} marginBottom={1}>
            <Color dim>↳{space}</Color>
            {tasksComplete ?
                <Color bold green>All Done!</Color> :
                <Fragment>
                    <Color dim>Finished </Color>
                    <Color bold white>{completed.length}</Color>
                    <Color bold dim> of </Color>
                    <Color bold white>{tasks.length - skipped.length}</Color>
                    <Color dim> tasks</Color>
                </Fragment>
            }
            <Color dim> (</Color>
            <Color bold>{completed.length}</Color>
            <Color dim> completed, </Color>
            <Color bold>{skipped.length}</Color>
            <Color dim> skipped</Color>
            <Color>)</Color>
        </Box>
    </Box>;
};
export const WarningAndErrorsHeader = ({errors, hasError, isOnline, options: {skipInstall}}) => <Fragment>
    {!isOnline && !skipInstall && <OfflineWarning/>}
    {hasError && <CommandError errors={errors}></CommandError>}
</Fragment>;
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
export const Tasks = ({debug, options, state, tasks}) => <Box flexDirection='column' marginBottom={1}>{
    tasks
        .filter(isValidTask)
        .filter(isUniqueTask)
        .map(({optional, text}, index) => {
            const {completed, errors, skipped} = state;
            const isSkipped = skipped.includes(index);
            const isComplete = completed.includes(index) || isSkipped;
            const isErrored = errors.map(error => error.payload.index).includes(index);
            const isPending = [isComplete, isSkipped, isErrored].every(val => !val);
            const maybeApplyOrReturnTrue = (val, options) => (val === undefined) || (is(Function)(val) && val(options));
            const showDebug = debug && <Color cyan>{index} - {text}</Color>;
            const shouldBeShown = maybeApplyOrReturnTrue(optional, options);
            const isCurrentOrPrevious = index <= Math.max(...completed, ...skipped) + 1;
            return (isCurrentOrPrevious && shouldBeShown) ?
                <Task
                    key={text}
                    text={text}
                    isSkipped={isSkipped}
                    isComplete={isComplete}
                    isErrored={isErrored}
                    isPending={isPending}>
                </Task> :
                <Box key={text}>{showDebug}</Box>;
        })
}</Box>;
export const TaskListTitle = ({command, hasError, isComplete, terms}) => <InkBox
    margin={{left: 1, top: 1}}
    padding={{left: 1, right: 1}}
    borderColor={isComplete ? 'green' : (hasError ? 'red' : 'cyan')}
    borderStyle={'round'}>
    <Color bolds>{command} {terms.join(' ')}</Color>
</InkBox>;
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
export const TaskList = ({command, commands, options, terms, done}) => {
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
        status: {online: true}
    };
    const [state, dispatch] = useReducer(reducer, initialState);
    const {completed, errors, skipped, status: {online}} = state;
    const {debug} = options;
    const tasks = terms
        .flatMap(term => commands[command][term])
        .flatMap(val => maybeApply(val, options))
        .flatMap(val => maybeApply(val, options));
    const customOptions = assign(tasks.filter(complement(isValidTask)).reduce((acc, val) => ({...acc, ...val}), options), {isNotOffline: online});
    const validTasks = tasks
        .filter(isValidTask)
        .filter(isUniqueTask);
    const tasksComplete = ((completed.length + skipped.length) === validTasks.length);
    const hasError = (errors.length > 0);
    const data = {
        tasks,
        terms,
        errors,
        skipped,
        completed,
        options: customOptions
    };
    useEffect(() => {
        populateQueue({tasks, dispatch, options: customOptions});
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    tasksComplete && maybeApply(done, customOptions);
    return <ErrorBoundary>
        {debug && <Debug data={data} title={'Tasklist data'}></Debug>}
        <WarningAndErrorsHeader errors={errors} hasError={hasError} isOnline={online} options={customOptions}></WarningAndErrorsHeader>
        <Box flexDirection={'column'} marginBottom={1}>
            <TaskListTitle command={command} hasError={hasError} isComplete={tasksComplete} terms={terms}></TaskListTitle>
            <Status completed={completed} skipped={skipped} tasks={validTasks}></Status>
            <Tasks debug={debug} options={customOptions} state={state} tasks={tasks}></Tasks>
        </Box>
    </ErrorBoundary>;
};
Check.propTypes = {
    isSkipped: PropTypes.bool
};
Check.defaultProps = {
    isSkipped: false
};
CheckBox.propTypes = {
    isSelected: PropTypes.bool
};
CheckBox.defaultProps = {
    isSelected: false
};
Debug.propTypes = {
    data: PropTypes.any,
    title: PropTypes.string
};
Description.propTypes = {
    command: PropTypes.string,
    descriptions: PropTypes.object
};
SubCommandSelect.propTypes = {
    command: PropTypes.string,
    descriptions: PropTypes.object,
    items: PropTypes.arrayOf(PropTypes.object),
    onSelect: PropTypes.func
};
SubCommandMultiSelect.propTypes = {
    descriptions: PropTypes.object,
    items: PropTypes.arrayOf(PropTypes.object),
    onSubmit: PropTypes.func
};
Indicator.propTypes = {
    isHighlighted: PropTypes.bool,
    isSelected: PropTypes.bool
};
Indicator.defaultProps = {
    isHighlighted: false,
    isSelected: false
};
Item.propTypes = {
    isHighlighted: PropTypes.bool,
    isSelected: PropTypes.bool,
    label: PropTypes.string.isRequired
};
Item.defaultProps = {
    isHighlighted: false,
    isSelected: false
};
ErrorMessage.propTypes = {
    info: PropTypes.string
};
ErrorBoundary.propTypes = {
    children: PropTypes.node
};
Status.propTypes = {
    completed: PropTypes.array,
    skipped: PropTypes.array,
    tasks: PropTypes.arrayOf(PropTypes.object)
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
    commands: PropTypes.object,
    options: PropTypes.any,
    terms: PropTypes.arrayOf(PropTypes.string),
    done: PropTypes.func
};
TaskList.defaultProps = {
    command: '',
    options: {skipInstall: false},
    terms: []
};
TaskListTitle.propTypes = {
    command: PropTypes.string,
    hasError: PropTypes.bool,
    isComplete: PropTypes.bool,
    terms: PropTypes.arrayOf(PropTypes.string)
};
Tasks.propTypes = {
    debug: PropTypes.bool,
    options: PropTypes.object,
    state: PropTypes.object,
    tasks: PropTypes.arrayOf(PropTypes.object)
};
Warning.propTypes = {
    callback: PropTypes.func,
    children: PropTypes.node
};
WarningAndErrorsHeader.propTypes = {
    errors: PropTypes.array,
    hasError: PropTypes.bool,
    isOnline: PropTypes.bool,
    options: PropTypes.object
};
