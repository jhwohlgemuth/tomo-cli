/**
 * Application Core
 * @version 1.0.0
 */
import * as Backbone from 'backbone';
import {Application, View} from 'backbone.marionette';
import AppRouter from 'marionette.approuter';
import {html} from 'lit-html';
import * as logging from '../plugins/mn.radio.logging';
import state from '../plugins/mn.redux.state';
import '../shims/mn.renderer.shim';
import header from './header';
import body from './body';
import footer from './footer';

const Router = AppRouter.extend({
    appRoutes: {
        hello: 'sayHello'
    }
});
const App = Application.extend({
    region: {
        el: 'body',
        replaceElement: true
    },
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
        const Model = Backbone.Model.extend({
            defaults: {name}
        });
        const MainView = View.extend({
            tagName: 'body',
            template: ({name}) => html`
                ${header({name})}
                ${body}
                ${footer({name})}
            `,
            model: new Model()
        });
        app.getRegion().show(new MainView());
        app.info(`${name} is started!`);
    }
});

export default Object.assign(new App(), logging, state);
