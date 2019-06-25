/**
 * Shim Marionette template renderer to use lit-html
 * @see https://github.com/polymer/lit-html
 * @see https://lit-html.polymer-project.org/guide/tools#development
 * @example <caption>It is also possible to use libraries such as morphdom</caption>
 * import * as Marionette from 'backbone.marionette';
 * import {template} from 'lodash-es';
 * import morphdom from 'morphdom';
 *
 * Marionette.View.setRenderer(function(html, data) {
 *     const {el} = this;
 *     const node = el.cloneNode(false);// shallow clone
 *     node.innerHTML = template(html)(data);
 *     morphdom(el, node);
 * });
 */
import * as Marionette from 'backbone.marionette';
import {render} from 'lit-html';

Marionette.View.setRenderer(function(template, data) {
    const {el} = this;
    render(typeof template === 'function' ? template(data) : template, el);
});
