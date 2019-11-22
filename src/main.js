import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bold} from 'chalk';
import figures from 'figures';
import {is} from 'ramda';
import {Color, Text} from 'ink';
import {
    ErrorBoundary,
    SubCommandSelect,
    TaskList,
    UnderConstruction,
    Warning,
    getIntendedInput
} from './api';
import commands from './commands';

const descriptions = {
    project: `Scaffold a new Node.js project with ${bold.yellow('Babel')}, ${bold('ESLint')}, and ${bold.magenta('Jest')}`,
    app: `Scaffold a new ${bold('web application')} - basically a project with CSS, bundling, and stuff`,
    server: `Scaffold Node.js WebSocket, GraphQL, and HTTP(S) servers with an 80% solution for security "baked in"`,
    a11y: `Add automated ${bold('accessibility')} testing`,
    babel: `Use next generation JavaScript, ${bold('today!')}`,
    browsersync: `Time-saving ${bold('synchronised browser')} testing (demo your app with ${bold.yellow('live-reload')})`,
    cypress: `${bold('Test')} anything that runs in a ${bold('browser')} (including ${bold.yellow('visual regression testing')})`,
    electron: `Create a ${bold('native desktop application')} using web technologies`,
    esdoc: `Generate ${bold('documentation')} from your comments`,
    eslint: `Pluggable ${bold('linting')} utility for JavaScript and JSX`,
    jest: `Delightful JavaScript ${bold('Testing')} Framework with a focus on simplicity`,
    makefile: `Create a ${bold('Makefile')} from your package.json, like ${bold.magenta('magic!')}`,
    marionette: `${bold('Flexible Backbone framework')} with robust views and architecture solutions`,
    parcel: `${bold('Bundle')} your application (${bold.red('blazing')} fast with ${bold.white('zero configuration')})`,
    postcss: `Use ${bold('future CSS')}, never write vendor prefixes again, and much much more!`,
    react: `Build user interfaces with ${bold('components')} ${figures.arrowRight} learn once, write ${bold('anywhere')}`,
    reason: `Write functional ${bold('type safe')} code with ${bold.yellow('JavaScript')}-like syntax (works with ${bold('React')})`,
    rollup: `${bold('Bundle')} your assets (focused on ${bold('ES6')} modules and tree shaking - ${bold.white('best for libraries')})`,
    webpack: `${bold('Bundle')} your assets (with great support and a rich ecosystem)`
};

/**
 * Main tomo UI component
 * @param {Object} props Component props
 * @return {ReactComponent} Main tomo UI component
 */
export default class UI extends Component {
    constructor(props) {
        super(props);
        const {flags, input} = props;
        const {ignoreWarnings} = flags;
        const [command, ...terms] = input;
        const hasCommand = is(String)(command);
        const hasTerms = terms.length > 0;
        const {intendedCommand, intendedTerms} = hasCommand ? getIntendedInput(commands, command, terms) : {};
        const compare = (term, index) => (term !== terms[index]);
        const showWarning = ((command !== intendedCommand) || (hasTerms && intendedTerms.map(compare).some(Boolean))) && !ignoreWarnings;
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
        return <ErrorBoundary>
            {showWarning ?
                <Warning callback={this.updateWarning}>
                    <Text>Did you mean <Color bold green>{intendedCommand} {intendedTerms.join(' ')}</Color>?</Text>
                </Warning> :
                (hasCommand && hasTerms) ?
                    <TaskList commands={commands} command={intendedCommand} terms={intendedTerms} options={flags} done={done}></TaskList> :
                    hasCommand ?
                        <SubCommandSelect
                            command={intendedCommand}
                            descriptions={descriptions}
                            items={Object.keys(commands[intendedCommand]).map(command => ({label: command, value: command}))}
                            onSelect={this.updateTerms}>
                        </SubCommandSelect> :
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
UI.propTypes = {
    input: PropTypes.array,
    flags: PropTypes.object,
    done: PropTypes.func,
    stdin: PropTypes.string
};
UI.defaultProps = {
    input: [],
    flags: {}
};