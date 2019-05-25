/**
 * Application Core
 * @version 1.0.0
 */
import {Application} from 'backbone.marionette';
import * as logging from '../plugins/mn.radio.logging';
import state from '../plugins/mn.redux.state';
// import './shims/mn.renderer.shim';

const App = Application.extend({
    region: 'body'
});

export default Object.assign(new App(),
    logging,
    state
);
