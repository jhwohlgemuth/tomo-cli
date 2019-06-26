/**
 * Add Redux store to application
 * @description Features:
 * - Enhanced getState that accepts path parameter
 * - "dispatch logging" middleware
 * - Basic reducer showcasing how to leverage lodash for updating state
 * @example <caption>Extend application object</caption>
 * import {Application} from 'backbone.marionette';
 * import state from './plugins/redux.state';
 * const app = new Application();
 * export default Object.assign(app, state);
 * @example <caption>Enhanced getState accepts path parameter</caption>
 * app.getState();// {count: 42}
 * app.getState('count');// 42
 * @example <caption>Update state with Redux API</caption>
 * app.getState('count');// 42
 * app.dispatch({type: 'INCREMENT'});
 * app.getState('count');// 43
 */
import {get, update} from 'lodash-es';
import {applyMiddleware, compose, createStore} from 'redux';

const initialState = {
    count: 42
};

export default createStore(
    reducer,
    initialState,
    compose(
        applyMiddleware(dispatchLogger),
        addGetStatePathParameter()
    )
);
// state reducer
function reducer(state, action) {
    switch (action.type) {
        case 'INCREMENT':
            return update(state, 'count', increment);
        case 'DECREMENT':
            return update(state, 'count', decrement);
        default:
            return state;
    }
}
// middleware
function dispatchLogger() {
    return next => action =>
        // console.log(`Dispatch: ${action.type}`);
        next(action)
    ;
}
// store enhancer
function addGetStatePathParameter() {
    return createStore => (reducer, preloadedState, enhancer) => {
        const store = createStore(reducer, preloadedState, enhancer);
        const getState = path => (typeof (path) === 'string') ? get(store.getState(), path) : store.getState();
        const {dispatch, subscribe} = store;
        return {getState, dispatch, subscribe};
    };
}
// pure functions
function increment(val) {
    return val + 1;
}
function decrement(val) {
    return val - 1;
}
