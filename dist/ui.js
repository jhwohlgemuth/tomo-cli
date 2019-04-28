"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.populateQueue = populateQueue;
exports.default = exports.TaskList = exports.Task = exports.Warning = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _isUndefined2 = _interopRequireDefault(require("lodash/isUndefined"));

var _isString2 = _interopRequireDefault(require("lodash/isString"));

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _pQueue = _interopRequireDefault(require("p-queue"));

var _ink = require("ink");

var _inkBox = _interopRequireDefault(require("ink-box"));

var _inkSpinner = _interopRequireDefault(require("ink-spinner"));

var _inkSelectInput = _interopRequireDefault(require("ink-select-input"));

var _figures = _interopRequireDefault(require("figures"));

var _commands = _interopRequireDefault(require("./commands"));

var _utils = require("./utils");

const Check = ({
  isSkipped
}) => _react.default.createElement(_ink.Text, {
  bold: true
}, _react.default.createElement(_ink.Color, {
  green: !isSkipped,
  dim: isSkipped
}, _figures.default.tick));

const Item = ({
  isSelected,
  label
}) => _react.default.createElement(_ink.Color, {
  bold: isSelected,
  cyan: isSelected
}, label);

const Indicator = ({
  isSelected
}) => _react.default.createElement(_ink.Box, {
  marginRight: 1
}, isSelected ? _react.default.createElement(_ink.Color, {
  bold: true,
  cyan: true
}, _figures.default.arrowRight) : ' ');

const SubCommandSelect = ({
  items,
  onSelect
}) => _react.default.createElement(_ink.Box, {
  paddingTop: 1,
  paddingBottom: 1,
  paddingLeft: 1
}, _react.default.createElement(_inkSelectInput.default, {
  items: items,
  onSelect: onSelect,
  itemComponent: Item,
  indicatorComponent: Indicator
}));

const UnderConstruction = () => _react.default.createElement(_ink.Box, {
  marginBottom: 1
}, _react.default.createElement(_inkBox.default, {
  padding: {
    left: 1,
    right: 1
  },
  margin: {
    left: 1,
    top: 1
  }
}, _react.default.createElement(_ink.Color, {
  bold: true,
  yellow: true
}, "UNDER CONSTRUCTION")));

const ErrorMessage = ({
  info
}) => _react.default.createElement(_ink.Box, {
  flexDirection: 'column',
  marginBottom: 1
}, _react.default.createElement(_inkBox.default, {
  borderColor: 'yellow',
  margin: {
    left: 1,
    top: 1
  },
  padding: {
    left: 1,
    right: 1
  }
}, _react.default.createElement(_ink.Color, {
  yellow: true
}, "(\u256F\xB0\u25A1 \xB0)\u256F \u253B\u2501\u253B arrrgh...")), _react.default.createElement(_ink.Box, {
  marginLeft: 4
}, "\u21B3 ", _react.default.createElement(_ink.Color, {
  dim: true
}, "Something went wrong...")), _react.default.createElement(_ink.Box, {
  marginLeft: 6,
  marginTop: 1
}, _react.default.createElement(_ink.Color, {
  dim: true
}, _react.default.createElement(_ink.Box, null, info))));

class ErrorBoundary extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: '',
      error: {},
      hasError: false
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true
    };
  }

  componentDidCatch(error, info) {
    this.setState({
      error,
      info
    });
  }

  render() {
    const {
      error,
      hasError
    } = this.state;
    const {
      children
    } = this.props;
    return hasError ? _react.default.createElement(ErrorMessage, {
      error: error
    }) : children;
  }

}
/**
 * Add async tasks to a queue, handle completion with actions dispatched via dispatch function
 * @param {Object} data Data to be used for populating queue
 * @param {Queue} [data.queue={}] p-queue instance
 * @param {Object[]} [data.tasks=[]] Array of task objects
 * @param {function} [data.dispatch=()=>{}] Function to dispatch task completion (complete, skip, error) actions
 * @param {Object} [data.options={}] Options object to pass to task function
 * @return {undefined} Returns nothing (side effects only)
 */


function populateQueue() {
  return _populateQueue.apply(this, arguments);
}
/**
 * Component to display warning message requiring user input
 * @param {Object} props Function component props
 * @param {ReactNode} props.children Function component children
 * @param {function} props.callback Function to be called after user interacts with warning
 * @return {ReactComponent} Warning component
 */


function _populateQueue() {
  _populateQueue = (0, _asyncToGenerator2.default)(function* (data = {
    queue: {},
    tasks: [],
    dispatch: () => {},
    options: {}
  }) {
    const {
      queue,
      tasks,
      dispatch,
      options
    } = data;

    for (const [index, item] of tasks.entries()) {
      const {
        condition,
        task
      } = item;

      try {
        if (yield condition(options)) {
          yield queue.add(() => task(options)).then(() => dispatch({
            type: 'complete',
            payload: index
          })).catch(() => dispatch({
            type: 'error',
            payload: 'Error adding task to queue'
          }));
        } else {
          dispatch({
            type: 'skipped',
            payload: index
          });
        }
      } catch (error) {
        dispatch({
          type: 'error',
          payload: error
        });
      }
    }
  });
  return _populateQueue.apply(this, arguments);
}

const Warning = ({
  callback,
  children
}) => {
  const {
    setRawMode,
    stdin
  } = (0, _react.useContext)(_ink.StdinContext);
  (0, _react.useEffect)(() => {
    setRawMode && setRawMode(true);
    stdin.on('data', callback);
    return function cleanup() {
      stdin.removeListener('data', callback);
      setRawMode && setRawMode(false);
    };
  });
  return _react.default.createElement(_ink.Box, {
    flexDirection: 'column',
    marginBottom: 1
  }, _react.default.createElement(_inkBox.default, {
    borderColor: 'yellow',
    margin: {
      left: 1,
      top: 1
    },
    padding: {
      left: 1,
      right: 1
    }
  }, _react.default.createElement(_ink.Color, {
    yellow: true
  }, "oops...")), _react.default.createElement(_ink.Box, {
    marginLeft: 4
  }, "\u21B3 ", children), _react.default.createElement(_ink.Box, {
    marginLeft: 6,
    marginTop: 1
  }, _react.default.createElement(_ink.Color, {
    dim: true
  }, "Press "), _react.default.createElement(_ink.Text, {
    bold: true
  }, "ENTER"), _react.default.createElement(_ink.Color, {
    dim: true
  }, " to continue")));
};
/**
 * Task component
 * @param {Object} props Function component props
 * @param {boolean} props.isComplete Control display of check (true) or loading (false)
 * @param {boolean} props.isSkipped Control color of check - green (false) or dim (true)
 * @param {string} props.text Task text
 * @example
 * <Task text={'This task is done before it starts'} isComplete={true}></Task>
 * @return {ReactComponent} Task component
 */


exports.Warning = Warning;

const Task = ({
  isComplete,
  isSkipped,
  text
}) => _react.default.createElement(_ink.Box, {
  flexDirection: "row",
  marginLeft: 3
}, isComplete ? _react.default.createElement(Check, {
  isSkipped: isSkipped
}) : _react.default.createElement(_ink.Color, {
  cyan: true
}, _react.default.createElement(_inkSpinner.default, null)), " ", _react.default.createElement(_ink.Text, null, _react.default.createElement(_ink.Color, {
  dim: isComplete
}, text)));
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


exports.Task = Task;

const TaskList = ({
  command,
  options,
  terms,
  done
}) => {
  const reducer = (state, {
    type,
    payload
  }) => {
    const {
      completed,
      errors,
      skipped
    } = state;

    if (type === 'complete') {
      return {
        completed: [...completed, payload],
        skipped,
        errors
      };
    } else if (type === 'skipped') {
      return {
        completed,
        skipped: [...skipped, payload],
        errors
      };
    } else if (type === 'error') {
      return {
        completed,
        skipped,
        errors: [...errors, {
          details: payload
        }]
      };
    }
  };

  const initialState = {
    completed: [],
    skipped: [],
    errors: []
  };
  const [state, dispatch] = (0, _react.useReducer)(reducer, initialState);
  const queue = new _pQueue.default({
    concurrency: 1
  });
  const tasks = _commands.default[command][terms[0]];
  (0, _react.useEffect)(() => {
    populateQueue({
      queue,
      tasks,
      options,
      dispatch
    });
  }, []);
  const tasksComplete = state.completed.length + state.skipped.length === tasks.length;
  tasksComplete && (0, _isFunction2.default)(done) && done();
  return _react.default.createElement(ErrorBoundary, null, _react.default.createElement(_ink.Box, {
    flexDirection: 'column',
    marginBottom: 1
  }, _react.default.createElement(_inkBox.default, {
    margin: {
      left: 1,
      top: 1
    },
    padding: {
      left: 1,
      right: 1
    },
    borderColor: tasksComplete ? 'green' : 'cyan',
    borderStyle: 'round'
  }, _react.default.createElement(_ink.Color, {
    bold: true,
    white: true
  }, command, " ", terms.join(' '))), _react.default.createElement(_ink.Box, {
    flexDirection: "column",
    marginBottom: 1
  }, tasks.map(({
    optional,
    text
  }, index) => {
    const {
      completed,
      skipped
    } = state;
    const isSkipped = skipped.includes(index);
    const isComplete = completed.includes(index) || isSkipped;
    const shouldBeShown = (0, _isUndefined2.default)(optional) || (0, _isFunction2.default)(optional) && optional(options);
    return shouldBeShown ? _react.default.createElement(Task, {
      text: text,
      isSkipped: isSkipped,
      isComplete: isComplete,
      key: index
    }) : _react.default.createElement(_ink.Box, {
      key: index
    });
  }))));
};
/**
 * Main tomo UI class
 */


exports.TaskList = TaskList;

class UI extends _react.Component {
  constructor(props) {
    super(props);
    const {
      input
    } = props;
    const [command, ...terms] = input;
    const hasCommand = (0, _isString2.default)(command);
    const hasTerms = terms.length > 0;
    const [intendedCommand, intendedTerms] = hasCommand ? (0, _utils.getIntendedInput)(_commands.default, command, terms) : [, []];

    const compareTerms = (term, index) => term !== terms[index];

    const showWarning = command !== intendedCommand || intendedTerms.map(compareTerms).some(Boolean);
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
    const {
      done,
      flags
    } = this.props;
    const {
      hasCommand,
      hasTerms,
      intendedCommand,
      intendedTerms,
      showWarning
    } = this.state;
    const {
      ignoreWarnings
    } = flags;
    const VALID_COMMANDS = hasCommand ? Object.keys(_commands.default[intendedCommand]) : [];
    const selectInputCommandItems = hasCommand ? VALID_COMMANDS.map(command => ({
      label: command,
      value: command
    })) : [];
    return _react.default.createElement(ErrorBoundary, null, showWarning && !ignoreWarnings ? _react.default.createElement(Warning, {
      callback: this.updateWarning
    }, _react.default.createElement(_ink.Text, null, "Did you mean ", _react.default.createElement(_ink.Color, {
      bold: true,
      green: true
    }, intendedCommand, " ", intendedTerms.join(' ')), "?")) : hasCommand && hasTerms ? _react.default.createElement(TaskList, {
      command: intendedCommand,
      terms: intendedTerms,
      options: flags,
      done: done
    }) : hasCommand ? _react.default.createElement(SubCommandSelect, {
      items: selectInputCommandItems,
      onSelect: this.updateTerms
    }) : _react.default.createElement(UnderConstruction, null));
  }
  /**
   * Callback function for warning component
   * @param {string} data Character data from stdin
   * @return {undefined} Returns nothing
   */


  updateWarning(data) {
    const key = String(data);
    key === '\r' ? this.setState({
      showWarning: false
    }) : process.exit(0);
  }
  /**
   * @param {Object} args Function options
   * @param {string} args.value Intended term
   * @return {undefined} Returns nothing
   */


  updateTerms({
    value
  }) {
    this.setState({
      hasTerms: true,
      intendedTerms: [value]
    });
  }

}

Check.propTypes = {
  isSkipped: _propTypes.default.bool
};
Check.defaultProps = {
  isSkipped: false
};
SubCommandSelect.propTypes = {
  items: _propTypes.default.arrayOf(_propTypes.default.object),
  onSelect: _propTypes.default.func
};
Indicator.propTypes = {
  isSelected: _propTypes.default.bool
};
Indicator.defaultProps = {
  isSelected: false
};
Item.propTypes = {
  isSelected: _propTypes.default.bool,
  label: _propTypes.default.string.isRequired
};
Item.defaultProps = {
  isSelected: false
};
ErrorMessage.propTypes = {
  info: _propTypes.default.string
};
ErrorBoundary.propTypes = {
  children: _propTypes.default.node
};
Task.propTypes = {
  isComplete: _propTypes.default.bool,
  isSkipped: _propTypes.default.bool,
  text: _propTypes.default.string
};
Task.defaultProps = {
  isComplete: false,
  isSkipped: false,
  text: 'task description'
};
TaskList.propTypes = {
  command: _propTypes.default.string,
  options: _propTypes.default.any,
  terms: _propTypes.default.arrayOf(_propTypes.default.string),
  done: _propTypes.default.func
};
TaskList.defaultProps = {
  command: '',
  options: {
    skipInstall: false
  },
  terms: []
};
Warning.propTypes = {
  callback: _propTypes.default.func,
  children: _propTypes.default.node
};
UI.propTypes = {
  input: _propTypes.default.array,
  flags: _propTypes.default.object,
  done: _propTypes.default.func
};
UI.defaultProps = {
  input: [],
  flags: {}
};
var _default = UI;
exports.default = _default;