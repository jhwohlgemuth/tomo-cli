/* eslint-env browser */
/**
 * @file Main entry point for application
 * @requires app
**/

const Backbone = require('backbone');
const Mn = require('backbone.marionette');
const app = require('app');
// const JST = require('templates');

const name = app.getState('name');

const RouterController = Mn.Object.extend({
    foo: function() {
        // code to be executed for 'foo' route
    }
});
const AppRouter = Mn.AppRouter.extend({
    appRoutes: {
        foo: 'foo'
    },
    controller: new RouterController()
});
const ExampleModel = Backbone.Model.extend({
    defaults: {name}
});
const View = Mn.View.extend({
    // view code goes here
    template: `<div>Hello world</div>`,
    model: new ExampleModel()
});
app.on('before:start', () => {
    app.info(`${name} is starting...`);
    app.router = new AppRouter();
});
app.on('start', () => {
    Backbone.history.start();
    app.info(`${name} is started!`);
    app.getRegion().show(new View());
});
document.addEventListener('DOMContentLoaded', () => app.start());
