import React, {Component, Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Conf from 'conf';
import {play} from 'figures';
import {is} from 'ramda';
import {Box, Color, Text} from 'ink';
import {
    ErrorBoundary,
    SubCommandSelect,
    TaskList,
    UnderConstruction,
    Warning,
    dict,
    getElapsedTime,
    getIntendedInput
} from './api';

const AnimatedIndicator = ({complete, elapsed}) => {
    const Active = () => <Color cyan>{play}</Color>;
    const Inactive = () => <Color dim>{play}</Color>;
    const gate = Number(elapsed.split(':')[2]) % 3;
    return complete ? <Color dim>runtime</Color> : <Box>
        {gate === 0 ? <Active /> : <Inactive />}
        {gate === 1 ? <Active /> : <Inactive />}
        {gate === 2 ? <Active /> : <Inactive />}
    </Box>;
};
const Timer = () => {
    const [start] = process.hrtime();
    const [complete, setComplete] = useState(false);
    const [elapsed, setElapsed] = useState('00:00:00');
    useEffect(() => {
        const id = setInterval(() => {
            setElapsed(getElapsedTime(start));
        }, 1000); // eslint-disable-line no-magic-numbers
        global._tomo_tasklist_callback = () => {// eslint-disable-line camelcase
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
            .filter(([, value]) => (typeof value === 'string'))
            .map(([name]) => name)
            .includes(command);
        const hasCommand = is(String)(command);
        const isTerminalCommand = hasCommand && isCustom(command);
        const hasTerms = terms.length > 0;
        const {intendedCommand, intendedTerms} = (hasCommand && !isTerminalCommand) ?
            getIntendedInput(commands, command, terms) :
            {intendedCommand: command, intendedTerms: terms};
        const compare = (term, index) => (term !== terms[index]);
        const showWarning = ((command !== intendedCommand) || (hasTerms && intendedTerms.map(compare).some(Boolean))) && !ignoreWarnings;
        this.store = new Conf({projectName: namespace});
        this.state = {
            hasTerms,
            hasCommand,
            showWarning,
            intendedTerms,
            intendedCommand,
            isTerminalCommand
        };
        this.updateWarning = this.updateWarning.bind(this);
        this.updateTerms = this.updateTerms.bind(this);
    }
    render() {
        const self = this;
        const {commands, descriptions, done, flags, customCommands} = self.props;
        const {hasCommand, hasTerms, intendedCommand, intendedTerms, isTerminalCommand, showWarning} = self.state;
        const store = self.props.store || self.store;
        const CustomCommand = () => {
            const lookup = dict(customCommands || {});
            const Command = lookup.has(intendedCommand) ? lookup.get(intendedCommand) : UnderConstruction;
            return <Command
                descriptions={descriptions}
                done={done}
                options={flags}
                store={store}
                terms={intendedTerms}/>;
        };
        return <ErrorBoundary>
            {showWarning ?
                <Warning callback={this.updateWarning}>
                    <Text>Did you mean <Color bold green>{intendedCommand} {intendedTerms.join(' ')}</Color>?</Text>
                </Warning> :
                (hasCommand && hasTerms) ?
                    isTerminalCommand ?
                        <CustomCommand/> :
                        (<Fragment>
                            <Timer callback={done} options={{store}}/>
                            <TaskList commands={commands} command={intendedCommand} terms={intendedTerms} options={{...flags, store}} done={done}></TaskList>
                        </Fragment>) :
                    hasCommand ?
                        (isTerminalCommand ?
                            <CustomCommand/> :
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
    callback: PropTypes.func,
    options: PropTypes.object
};
UI.propTypes = {
    commands: PropTypes.object,
    descriptions: PropTypes.object,
    done: PropTypes.func,
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