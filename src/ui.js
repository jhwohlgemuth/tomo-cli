/**
 * @file UI Components
 * @author Jason Wohlgemuth
 * @module ui
 * @requires module:utils
 * @requires module:commands
 */
import React, {useContext, useEffect, useReducer, Component} from 'react';
import PropTypes from 'prop-types';
import {isFunction, isString, isUndefined} from 'lodash';
import Queue from 'p-queue';
import {Box, Color, Text, StdinContext} from 'ink';
import {default as InkBox} from 'ink-box';
import Spinner from 'ink-spinner';
import SelectInput from 'ink-select-input';
import figures from 'figures';
import commands from './commands';
import {getIntendedInput} from './utils';

const Check = ({isSkipped}) => (<Text bold>
    <Color green={!isSkipped} dim={isSkipped}>{figures.tick}</Color>
</Text>);
const Item = ({isSelected, label}) => <Color bold={isSelected} cyan={isSelected}>{label}</Color>;
const Indicator = ({isSelected}) => <Box marginRight={1}>{isSelected ? <Color bold cyan>{figures.arrowRight}</Color> : ' '}</Box>;
const SubCommandSelect = ({items, onSelect}) => <Box paddingTop={1} paddingBottom={1} paddingLeft={1}>
    <SelectInput
        items={items}
        onSelect={onSelect}
        itemComponent={Item}
        indicatorComponent={Indicator}
    ></SelectInput>
</Box>;
/**
 * @private
 * @function UnderConstruction
 * @constructor
 * @description Component to display "under construction" warning for capabilities not yet implemented.
 */
const UnderConstruction = () => <Box marginBottom={1}>
    <InkBox padding={{left: 1, right: 1}} margin={{left: 1, top: 1}}>
        <Color bold yellow>UNDER CONSTRUCTION</Color>
    </InkBox>
</Box>;
/**
 * @private
 * @function ErrorMessage
 * @constructor
 * @description Used by ErrorBoundary component to display error message and data
 * @property {Object} props
 * @property {string} props.info Error details
 * @return {string} HTML markup for ErrorMessage component
 */
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
/**
 * @private
 * @function ErrorBoundary
 * @constructor
 * @extends React.Component
 * @description Error boundary used around UI component
 */
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
 * @function Warning
 * @constructor
 * @description Component to display warning message requiring user input
 * @property {Object} props
 * @property {function} props.callback Function to be called after user interacts with warning
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
/**
 * @function Task
 * @constructor
 * @description Task component
 * @property {Object} props
 * @property {boolean} props.isComplete Control display of check (true) or loading (false)
 * @property {boolean} props.isSkipped Control color of check - green (false) or dim (true)
 * @property {string} props.text Task text
 * @example
 * <Task text={'This task is done before it starts'} isComplete={true}></Task>
 */
export const Task = ({isComplete, isSkipped, text}) => <Box flexDirection='row' marginLeft={3}>
    {isComplete ?
        <Check isSkipped={isSkipped}></Check> :
        <Color cyan><Spinner></Spinner></Color>
    } <Text><Color dim={isComplete}>{text}</Color></Text>
</Box>;
/**
 * @function TaskList
 * @constructor
 * @description Task list component
 * @property {Object} props
 * @property {string} props.command Command - new | create | add
 * @property {Object} props.options Command line flags (see help)
 * @property {string[]} props.terms Terms - eslint | babel | jest | postcss | docs
 * @example
 * <TaskList command={'add'} terms={'eslint'} options={{skipInstall: true}}></TaskList>
 */
export const TaskList = ({command, options, terms}) => {
    const reducer = (state, {type, payload}) => {
        const {completed, error, skipped} = state;
        if (type === 'complete') {
            return {
                completed: [...completed, payload],
                error,
                skipped
            };
        } else if (type === 'skipped') {
            return {
                completed,
                error,
                skipped: [...skipped, payload]
            };
        } else if (type === 'error') {
            return {
                completed,
                error: {
                    status: Symbol('Error'),
                    details: payload
                },
                skipped
            };
        }
    };
    const initialState = {
        completed: [],
        error: {
            status: Symbol('OK'),
            details: ''
        },
        skipped: []
    };
    const [state, dispatch] = useReducer(reducer, initialState);
    const queue = new Queue({concurrency: 1});
    const tasks = commands[command][terms[0]];
    useEffect(() => {
        async function populateQueue() {
            for (const [index, item] of tasks.entries()) {
                const {condition, task} = item;
                try {
                    if (await condition(options)) {
                        try {
                            await queue
                                .add(() => task(options))
                                .then(() => dispatch({type: 'complete', payload: index}))
                                .catch(() => dispatch({type: 'error', payload: 'Error adding task to queue'}));
                        } catch (error) {
                            dispatch({type: 'error', payload: error});
                        }
                    } else {
                        dispatch({type: 'skipped', payload: index});
                    }
                } catch (error) {
                    dispatch({type: 'error', payload: error});
                }
            }
        }
        populateQueue();
    }, []);
    return <Box flexDirection={'column'} marginBottom={1}>
        <InkBox
            margin={{left: 1, top: 1}}
            padding={{left: 1, right: 1}}
            borderColor={((state.completed.length + state.skipped.length) === tasks.length) ? 'green' : 'cyan'}
            borderStyle={'round'}>
            <Color bold white>{command} {terms.join(' ')}</Color>
        </InkBox>
        <Box flexDirection='column' marginBottom={1}>
            {tasks.map(({optional, text}, index) => {
                const {completed, skipped} = state;
                const isSkipped = skipped.includes(index);
                const isComplete = completed.includes(index) || isSkipped;
                const shouldBeShown = isUndefined(optional) || (isFunction(optional) && optional(options));
                return shouldBeShown ?
                    <Task text={text} isSkipped={isSkipped} isComplete={isComplete} key={index}></Task> :
                    <Box key={index}></Box>;
            })}
        </Box>
    </Box>;
};
class UI extends Component {
    constructor(props) {
        super(props);
        const {input} = props;
        const [command, ...terms] = input;
        const hasCommand = isString(command);
        const hasTerms = terms.length > 0;
        const [intendedCommand, intendedTerms] = hasCommand ? getIntendedInput(commands, command, terms) : [, []];
        const compareTerms = (term, index) => (term !== terms[index]);
        const showWarning = (command !== intendedCommand) || (intendedTerms.map(compareTerms).some(Boolean));
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
        const {flags} = this.props;
        const {hasCommand, hasTerms, intendedCommand, intendedTerms, showWarning} = this.state;
        const {ignoreWarnings} = flags;
        const VALID_COMMANDS = hasCommand ? Object.keys(commands[intendedCommand]) : [];
        const selectInputCommandItems = hasCommand ? VALID_COMMANDS.map(command => ({label: command, value: command})) : [];
        return <ErrorBoundary>
            {(showWarning && !ignoreWarnings) ?
                <Warning callback={this.updateWarning}>
                    <Text>Did you mean <Color bold green>{intendedCommand} {intendedTerms.join(' ')}</Color>?</Text>
                </Warning> :
                (hasCommand && hasTerms) ?
                    <TaskList command={intendedCommand} terms={intendedTerms} options={flags}></TaskList> :
                    hasCommand ?
                        <SubCommandSelect items={selectInputCommandItems} onSelect={this.updateTerms}></SubCommandSelect> :
                        <UnderConstruction/>
            }
        </ErrorBoundary>;
    }
    updateWarning(data) {
        const key = String(data);
        (key === '\r') ? this.setState({showWarning: false}) : process.exit(0);
    }
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
    isSkipped: PropTypes.bool,
    text: PropTypes.string
};
Task.defaultProps = {
    isComplete: false,
    isSkipped: false,
    text: 'task description'
};
TaskList.propTypes = {
    command: PropTypes.string,
    options: PropTypes.any,
    terms: PropTypes.arrayOf(PropTypes.string)
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
    flags: PropTypes.object
};
UI.defaultProps = {
    input: [],
    flags: {}
};

export default UI;
