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
const template = `
<section>
    <img src="assets/images/blank_canvas.png"/>
    <p>What happens next is up to you...</p>
</section>
<footer>
    <p>
        <%= name %> was created with <span class="heart">❤</span> using <a href="https://github.com/jhwohlgemuth/tomo-cli">tomo-cli</a>
    </p>
    <p>
        Illustration created by <a href="https://twitter.com/ninalimpi">Katerina Limpitsouni</a>,
        available at <a href="https://undraw.co/">unDraw</a>
    </p>
    <p>
        Sans Forgetica font available for free from <a href="https://www.sansforgetica.rmit/">RMIT University</a>
    </p>
</footer>
`;
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
            template,
            model: new ExampleModel()
        });
        app.getRegion().show(new ExampleView());
        app.info(`${name} is started!`);
    }
});

export default Object.assign(new App(), logging, state);
