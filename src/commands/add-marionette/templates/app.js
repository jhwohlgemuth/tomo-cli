/**
 * Application Core
 * @version 1.0.0
*/
import * as Backbone from 'backbone';
import {Application, View} from 'backbone.marionette';
import AppRouter from 'marionette.approuter';
import * as logging from '../plugins/mn.radio.logging';
import state from '../plugins/mn.redux.state';
import '../shims/mn.renderer.shim';

const Router = AppRouter.extend({
    appRoutes: {
        hello: 'sayHello'
    }
});
const App = Application.extend({
    region: 'body',
    onBeforeStart(app, options) {
        const {name} = options;
        const controller = {
            sayHello: function() {
                app.info('hello');
            }
        };
        app.info(`${name} is starting...`);
        app.router = new Router({controller});
        Backbone.history.start();
    },
    onStart(app, options) {
        const {name} = options;
        const ExampleModel = Backbone.Model.extend({
            defaults: {name}
        });
        const ExampleView = View.extend({
            template: '<div><%= name %> is functioning as desired!</div>',
            model: new ExampleModel()
        });
        app.getRegion().show(new ExampleView());
        app.info(`${name} is started!`);
    }
});

export default Object.assign(new App(), logging, state);
