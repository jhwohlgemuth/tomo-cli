"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.populateQueue = populateQueue;
exports.default = exports.TaskList = exports.Task = exports.CommandError = exports.OfflineWarning = exports.Warning = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = require("lodash");

var _pQueue = _interopRequireDefault(require("p-queue"));

var _isOnline = _interopRequireDefault(require("is-online"));

var _ink = require("ink");

var _inkBox = _interopRequireDefault(require("ink-box"));

var _inkSpinner = _interopRequireDefault(require("ink-spinner"));

var _inkSelectInput = _interopRequireDefault(require("ink-select-input"));

var _figures = _interopRequireDefault(require("figures"));

var _commands = _interopRequireDefault(require("./commands"));

var _utils = require("./utils");

const pino = require('pino');

const {
  assign,
  entries
} = Object;
const space = ' ';

const Check = ({
  isSkipped
}) => _react.default.createElement(_ink.Color, {
  bold: true,
  green: !isSkipped,
  dim: isSkipped
}, _figures.default.tick, space);

const X = () => _react.default.createElement(_ink.Color, {
  bold: true,
  red: true
}, _figures.default.cross, space);

const Pending = () => _react.default.createElement(_ink.Color, {
  cyan: true
}, _react.default.createElement(_inkSpinner.default, null), space);

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
 * Component to display warning message requiring user input
 * @param {Object} props Function component props
 * @param {ReactNode} props.children Function component children
 * @param {function} props.callback Function to be called after user interacts with warning
 * @return {ReactComponent} Warning component
 */


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

exports.Warning = Warning;

const OfflineWarning = () => _react.default.createElement(_ink.Box, {
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
}, "(\u2312_\u2312;) This is awkward...")), _react.default.createElement(_ink.Box, {
  marginLeft: 4,
  flexDirection: 'column'
}, _react.default.createElement(_ink.Box, null, "\u21B3 ", _react.default.createElement(_ink.Text, null, "...but you appear to be ", _react.default.createElement(_ink.Color, {
  bold: true,
  red: true
}, "offline"))), _react.default.createElement(_ink.Box, null, "\u21B3 ", _react.default.createElement(_ink.Text, null, "Please connect to the internet and ", _react.default.createElement(_ink.Color, {
  bold: true,
  cyan: true
}, "try again")))), _react.default.createElement(_ink.Box, {
  marginLeft: 6,
  marginTop: 1
}, _react.default.createElement(_ink.Color, {
  dim: true
}, "No dependencies were installed")));

exports.OfflineWarning = OfflineWarning;

const CommandError = errors => {
  const log = pino({
    prettyPrint: {
      levelFirst: true
    }
  }, pino.destination('./tomo-errors.txt'));
  (0, _react.useEffect)(() => {
    log.error(errors);
  }, []);
  return _react.default.createElement(_ink.Box, {
    flexDirection: 'column',
    marginTop: 1,
    marginLeft: 1
  }, _react.default.createElement(_ink.Box, null, _react.default.createElement(X, null), _react.default.createElement(_ink.Text, null, "Something has gone horribly ", _react.default.createElement(_ink.Color, {
    bold: true,
    red: true
  }, "wrong"))), _react.default.createElement(_ink.Box, {
    marginLeft: 2
  }, "\u21B3", space, _react.default.createElement(_ink.Color, {
    dim: true
  }, "Details written to ./tomo-errors.txt")));
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


exports.CommandError = CommandError;

function populateQueue() {
  return _populateQueue.apply(this, arguments);
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


function _populateQueue() {
  _populateQueue = (0, _asyncToGenerator2.default)(function* (data = {
    queue: {},
    tasks: [],
    dispatch: () => {},
    options: {
      skipInstall: false
    }
  }) {
    const {
      queue,
      tasks,
      dispatch,
      options
    } = data;
    const {
      skipInstall
    } = options;
    const isNotOffline = skipInstall || (yield (0, _isOnline.default)());
    dispatch({
      type: 'status',
      payload: isNotOffline ? 'online' : 'offline'
    });

    for (const [index, item] of tasks.entries()) {
      const {
        condition,
        task
      } = item;

      try {
        if (yield condition((0, _objectSpread2.default)({}, options, {
          isNotOffline
        }))) {
          yield queue.add(() => task((0, _objectSpread2.default)({}, options, {
            isNotOffline
          }))).then(() => dispatch({
            type: 'complete',
            payload: index
          })).catch(() => dispatch({
            type: 'error',
            payload: {
              index,
              title: 'Failed to add task to queue',
              location: 'task',
              details: item.text
            }
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
  });
  return _populateQueue.apply(this, arguments);
}

const Task = ({
  isComplete,
  isErrored,
  isPending,
  isSkipped,
  text
}) => _react.default.createElement(_ink.Box, {
  flexDirection: "row",
  marginLeft: 3
}, isComplete && _react.default.createElement(Check, {
  isSkipped: isSkipped
}), isErrored && _react.default.createElement(X, null), isPending && _react.default.createElement(Pending, null), _react.default.createElement(_ink.Text, null, _react.default.createElement(_ink.Color, {
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
  const dict = val => new Map(entries(val));

  const reducer = (state, {
    type,
    payload
  }) => {
    const {
      completed,
      errors,
      skipped
    } = state;

    const update = val => assign({}, state, val);

    const lookup = dict({
      complete: () => update({
        completed: [...completed, payload]
      }),
      skipped: () => update({
        skipped: [...skipped, payload]
      }),
      error: () => update({
        errors: [...errors, {
          payload
        }]
      }),
      status: () => update({
        status: payload
      })
    });
    return lookup.get(type)();
  };

  const initialState = {
    completed: [],
    skipped: [],
    errors: []
  };
  const [state, dispatch] = (0, _react.useReducer)(reducer, initialState);
  const {
    completed,
    errors,
    skipped,
    status
  } = state;
  const queue = new _pQueue.default({
    concurrency: 1
  });
  const tasks = terms.map(term => _commands.default[command][term]).flat(1);
  const tasksComplete = completed.length + skipped.length === tasks.length;
  const hasError = errors.length > 0;
  const {
    skipInstall
  } = options;
  (0, _react.useEffect)(() => {
    populateQueue({
      queue,
      tasks,
      options,
      dispatch
    });
  }, []);
  tasksComplete && (0, _lodash.isFunction)(done) && done();
  return _react.default.createElement(ErrorBoundary, null, status === 'offline' && !skipInstall && _react.default.createElement(OfflineWarning, null), hasError && _react.default.createElement(CommandError, {
    errors: errors
  }), _react.default.createElement(_ink.Box, {
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
    borderColor: tasksComplete ? 'green' : hasError ? 'red' : 'cyan',
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
      errors,
      skipped
    } = state;
    const isSkipped = skipped.includes(index);
    const isComplete = completed.includes(index) || isSkipped;
    const isErrored = errors.map(error => error.payload.index).includes(index);
    const isPending = [isComplete, isSkipped, isErrored].every(val => !val);
    const shouldBeShown = (0, _lodash.isUndefined)(optional) || (0, _lodash.isFunction)(optional) && optional(options);
    return shouldBeShown ? _react.default.createElement(Task, {
      text: text,
      isSkipped: isSkipped,
      isComplete: isComplete,
      isErrored: isErrored,
      isPending: isPending,
      key: index
    }) : _react.default.createElement(_ink.Box, {
      key: index
    });
  }))));
};
/**
 * Main tomo UI component
 * @param {Object} props Component props
 * @return {ReactComponent} Main tomo UI component
 */


exports.TaskList = TaskList;

const UI = props => {
  const {
    done,
    flags,
    input
  } = props;
  const {
    ignoreWarnings
  } = flags;
  const [command, ...terms] = input;
  const hasCommand = (0, _lodash.isString)(command);
  const intended = hasCommand ? (0, _utils.getIntendedInput)(_commands.default, command, terms) : [, []];
  const {
    intendedCommand
  } = intended;
  const [hasTerms, setHasTerms] = (0, _react.useState)(terms.length > 0);
  const [intendedTerms, setIntendedTerms] = (0, _react.useState)(intended.intendedTerms);

  const compare = (term, index) => term !== terms[index];

  const [showWarning, setShowWarning] = (0, _react.useState)((command !== intendedCommand || intendedTerms.map(compare).some(Boolean)) && !ignoreWarnings);
  const VALID_COMMANDS = hasCommand ? Object.keys(_commands.default[intendedCommand]) : [];
  const selectInputCommandItems = hasCommand ? VALID_COMMANDS.map(command => ({
    label: command,
    value: command
  })) : [];

  const updateWarning = data => {
    const key = String(data);
    key === '\r' ? setShowWarning(false) : process.exit(0);
  };

  const updateTerms = ({
    value
  }) => {
    setHasTerms(true);
    setIntendedTerms([value]);
  };

  return _react.default.createElement(ErrorBoundary, null, showWarning ? _react.default.createElement(Warning, {
    callback: updateWarning
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
    onSelect: updateTerms
  }) : _react.default.createElement(UnderConstruction, null));
};

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
  isErrored: _propTypes.default.bool,
  isSkipped: _propTypes.default.bool,
  isPending: _propTypes.default.bool,
  text: _propTypes.default.string
};
Task.defaultProps = {
  isComplete: false,
  isErrored: false,
  isSkipped: false,
  isPending: false,
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