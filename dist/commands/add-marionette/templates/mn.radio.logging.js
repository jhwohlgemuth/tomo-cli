/* eslint strict: 0 */
/* eslint no-console: 0 */
/* eslint complexity: ['warn', 6] */
/**
 * Logging module that leverages Backbone.Radio
 * @example <caption>Use console message methods with custom stylized output</caption>
 * import {log, info, warn, error} from './plugins/radio.logging';
 * log('hello world');
 * info('hello world');
 * warn('hello world');
 * error('hello world');
 * @example <caption>Leverage Backbone.Radio to "tune" in and out on channels</caption>
 * import {radio} from './plugins/radio.logging';
 * setInterval(function() {
 *    radio.channel('test').trigger('log', 'message');
 * }, 1000);
 * radio.level('log');   //set logging level
 * radio.tuneIn('test'); //no need to create the channel first
 * // See some beautiful log messages in the console
 * radio.tuneOut('test'); //messages on test channel will no longer be shown
 * //Note: Remove 'test' channel with app.radio.reset('test')
 * @example <caption>Choose what level gets shown</caption>
 * import {radio} from './plugins/mn.radio.logging';
 * radio.level('log'); //show all logs
 * radio.tuneIn('test'); //no need to create the channel first
 * setInterval(function() {
 *    radio.channel('test').trigger('log', 'message');
 *    radio.channel('test').trigger('info', 'message');
 *    radio.channel('test').trigger('warn', 'message');
 *    radio.channel('test').trigger('error', 'message');
 * }, 1000);
 * radio.level('none');  //show no logs
 * radio.level('error'); //only show 'error' logs
 * radio.level('warn');  //show 'error' and 'warn' logs
 * // Note: Unless directly set with level(), the default behavior is to show no logs
 * // Note: Return current logging level with app.radio.level()
 * // Note: Return channels with app.radio.channels()
 * @example <caption>Extend application object</caption>
 * import {Application} from 'backbone.marionette';
 * import * as logging from './plugins/radio.logging';
 * const app = new Application();
 * export default Object.assign(app, logging);
 */
'use strict';

import {zipObject, isNumber, isString} from 'lodash-es';
import Radio from 'backbone.radio';

const {assign, create, keys} = Object;

Radio.DEBUG = false;// Show & Hide Backbone.Radio debug messages
const APP_LOGGING = true;// Show & Hide Application console messages
const MSG_PREFIX = '%c APP ❱❱ %c';
const MSG_TYPES = ['error', 'warn', 'info', 'log', 'trace'];
const MSG_DICT = zipObject(MSG_TYPES, MSG_TYPES.map((type, i) => i));
const noop = () => { };
const STYLE = {
    none: 'background:inherit;color:inherit;',
    error: 'background:red;color:white;',
    warn: 'background:yellow;color:black;',
    info: 'background:blue;color:white;',
    log: 'background:#333;color:white;'
};
function consoleMessage(type) {
    return Function.prototype.bind.call(console[type], console, MSG_PREFIX, STYLE[type], STYLE.none);
}
const channelMethods = create(null);
channelMethods.getChannels = function() {
    return keys(Radio._channels);
};
channelMethods.level = function(value) {
    if (typeof (value) !== 'undefined') {
        let level;
        if (isNumber(value) && value < MSG_TYPES.length) {
            level = value;
        } else if (isString(value)) {
            level = MSG_TYPES.includes(value) ? MSG_DICT[value] + 1 : 0;
        }
        channelMethods._level = level;
    }
    return channelMethods._level;
};
Radio.log = function(channelName, type, ...args) {
    type = MSG_TYPES.includes(type) ? type : 'log';
    const level = MSG_DICT[type];
    const msg = args.length > 2 ? args[2] : args[1];
    if (level < channelMethods.level()) {
        consoleMessage(type)(`[${channelName}] `, msg, Date.now());
    }
};
export const radio = assign({}, Radio, channelMethods);
export const log = APP_LOGGING ? consoleMessage('log') : noop;
export const info = APP_LOGGING ? consoleMessage('info') : noop;
export const warn = APP_LOGGING ? consoleMessage('warn') : noop;
export const error = APP_LOGGING ? consoleMessage('error') : noop;