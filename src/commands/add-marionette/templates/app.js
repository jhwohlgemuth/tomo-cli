/**
 * Application Core
 * @version 1.0.0
 */
import Mn from 'backbone.marionette';
import logging from '../plugins/mn.radio.logging';
import state from '../plugins/mn.redux.state';
// import './shims/mn.renderer.shim';

const Application = Mn.Application.extend({
    region: 'body'
});

export default Object.assign(new Application(),
    logging,
    state
);
