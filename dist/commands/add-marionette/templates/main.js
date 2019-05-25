/* eslint-env browser */
/**
 * Main entry point for application
 */
import {template} from 'lodash-es';
import * as Backbone from 'backbone';
import {View} from 'backbone.marionette';
import app from './components/app';
// const JST = require('templates');

const name = app.getState('name');

const ExampleModel = Backbone.Model.extend({
    defaults: {name}
});
const ExampleView = View.extend({
    // view code goes here
    template: template(`<div>It is functioning as desired!</div>`),
    model: new ExampleModel()
});
app.on('before:start', () => {
    app.info(`${name} is starting...`);
});
app.on('start', () => {
    app.info(`${name} is started!`);
    app.getRegion().show(new ExampleView());
});
document.addEventListener('DOMContentLoaded', () => app.start());
