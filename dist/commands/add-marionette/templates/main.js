/* eslint-env browser */
/**
 * @file Main entry point for application
 * @requires app
**/

const Backbone = require('backbone');
const Mn = require('backbone.marionette');
const _ = require('lodash');
const app = require('components/app');
// const JST = require('templates');

const name = app.getState('name');

const ExampleModel = Backbone.Model.extend({
    defaults: {name}
});
const View = Mn.View.extend({
    // view code goes here
    template: _.template(`<div>Hello world</div>`),
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
