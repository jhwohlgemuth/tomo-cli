/**
 * Shim Marionette template renderer to use morphdom. Other options include: inferno, snabbdom, rivets, idom and virtual-dom
 * @see https://github.com/blikblum/marionette.renderers
 */
import {template} from 'lodash-es';
import * as Marionette from 'backbone.marionette';
import morphdom from 'morphdom';

Marionette.View.setRenderer(function(html, data) {
    const {el} = this;
    const node = el.cloneNode(false);// shallow clone
    node.innerHTML = template(html)(data);
    morphdom(el, node);
});
