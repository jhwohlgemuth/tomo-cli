/* eslint complexity: ["warn", 8] */
import React, {Component, Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Conf from 'conf';
import {play} from 'figures';
import {is} from 'ramda';
import {Box, Text} from 'ink';
import {
    ErrorBoundary,
    SubCommandSelect,
    TaskList,
    UnderConstruction,
    Warning,
    dict,
    getElapsedTime,
    getIntendedInput
} from '../api';

const AnimatedIndicator = ({complete, elapsed}) => {
    const Active = () => <Text color="cyan">{play} </Text>;
    const Inactive = () => <Text dim>{play} </Text>;
    const gate = Number(elapsed.split(':')[2]) % 3;
    return complete ? <Text dim>runtime</Text> : <Box>
        {gate === 0 ? <Active /> : <Inactive />}
        {gate === 1 ? <Active /> : <Inactive />}
        {gate === 2 ? <Active /> : <Inactive />}
    </Box>;
};
const Timer = ({onComplete, options}) => {
    const {store} = options;
    const [start] = process.hrtime();
    const [complete, setComplete] = useState(false);
    const [elapsed, setElapsed] = useState('00:00:00');
    useEffect(() => {
        const id = setInterval(() => {
            setElapsed(getElapsedTime(start));
        }, 1000); // eslint-disable-line no-magic-numbers
        global._tomo_tasklist_callback = () => {// eslint-disable-line camelcase
            typeof onComplete === 'function' && onComplete(store, start);
            setComplete(true);
            clearInterval(id);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return <Box marginTop={1} marginLeft={1}>
        <AnimatedIndicator elapsed={elapsed} complete={complete}/>
        <Text> {elapsed}</Text>
    </Box>;
};
/**
 * Main tomo UI component
 * @param {Object} props Component props
 * @return {ReactComponent} Main tomo UI component
 */
export default class UI extends Component {
    constructor(props) {
        super(props);
        const {commands, flags, input, namespace} = props;
        const {ignoreWarnings} = flags;
        const [command, ...terms] = input;
        const isCustom = command => Object.entries(commands)
            .filter(([, value]) => is(String)(value))
            .map(([name]) => name)
            .includes(command);
        const hasCommand = is(String)(command);
        const isCustomCommand = isCustom(command);
        const hasTerms = terms.length > 0;
        const {intendedCommand, intendedTerms} = isCustom(command) ?
            {intendedCommand: command, intendedTerms: terms} :
            getIntendedInput(commands, command, terms);
        const compare = (term, index) => (term !== terms[index]);
        const showWarning = ((command !== intendedCommand) || (hasTerms && intendedTerms.map(compare).some(Boolean))) && !ignoreWarnings;
        this.store = new Conf({projectName: namespace});
        this.state = {
            hasTerms,
            hasCommand,
            showWarning,
            intendedTerms,
            intendedCommand,
            isCustomCommand
        };
        this.updateWarning = this.updateWarning.bind(this);
        this.updateTerms = this.updateTerms.bind(this);
    }
    render() {
        const self = this;
        const {commands, descriptions, onComplete, flags, customCommands = {}, stdin} = self.props;
        const {hasCommand, hasTerms, intendedCommand, intendedTerms, isCustomCommand, showWarning} = self.state;
        const store = self.props.store || self.store;
        const done = () => typeof global._tomo_tasklist_callback === 'function' && global._tomo_tasklist_callback();
        const CustomCommand = () => {
            const lookup = dict(customCommands);
            const Command = lookup.has(intendedCommand) ? lookup.get(intendedCommand) : UnderConstruction;
            return <Command
                descriptions={descriptions}
                done={done}
                options={flags}
                stdin={stdin}
                store={store}
                terms={intendedTerms}/>;
        };
        return <ErrorBoundary>
            {showWarning ?
                <Warning callback={this.updateWarning}>
                    <Text>Did you mean <Text bold color="green">{intendedCommand} {intendedTerms.join(' ')}</Text>?</Text>
                </Warning> :
                (hasCommand && hasTerms) ?
                    isCustomCommand ?
                        <CustomCommand stdin={stdin}/> :
                        (<Fragment>
                            <Timer onComplete={onComplete} options={{store}}/>
                            <TaskList
                                commands={commands}
                                command={intendedCommand}
                                terms={intendedTerms}
                                options={{...flags, store}}
                                done={done}>
                            </TaskList>
                        </Fragment>) :
                    hasCommand ?
                        (isCustomCommand ?
                            <CustomCommand stdin={stdin}/> :
                            <SubCommandSelect
                                command={intendedCommand}
                                descriptions={descriptions}
                                items={Object.keys(commands[intendedCommand]).map(command => ({label: command, value: command}))}
                                onSelect={this.updateTerms}/>) :
                        <UnderConstruction/>
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
AnimatedIndicator.propTypes = {
    complete: PropTypes.bool,
    elapsed: PropTypes.string
};
Timer.propTypes = {
    onComplete: PropTypes.func,
    options: PropTypes.object
};
UI.propTypes = {
    commands: PropTypes.object,
    descriptions: PropTypes.object,
    flags: PropTypes.object,
    input: PropTypes.array,
    namespace: PropTypes.string,
    stdin: PropTypes.string,
    store: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    customCommands: PropTypes.object
};
UI.defaultProps = {
    input: [],
    flags: {}
};