/* eslint-env browser */
/**
 * Main entry point for application
 */
import {template} from 'lodash';
import {Model} from 'backbone';
import Mn from 'backbone.marionette';
import app from 'components/app';
// const JST = require('templates');

const name = app.getState('name');

const ExampleModel = Model.extend({
    defaults: {name}
});
const View = Mn.View.extend({
    // view code goes here
    template: template(`<div>Hello world</div>`),
    model: new ExampleModel()
});
app.on('before:start', () => {
    app.info(`${name} is starting...`);
});
app.on('start', () => {
    app.info(`${name} is started!`);
    app.getRegion().show(new View());
});
document.addEventListener('DOMContentLoaded', () => app.start());
