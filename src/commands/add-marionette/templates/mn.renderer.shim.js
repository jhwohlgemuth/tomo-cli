/**
 * @file Shim Marionette template renderer to use morphdom
 * Other options include: inferno, snabbdom, rivets, idom and virtual-dom
 * @see https://github.com/blikblum/marionette.renderers
**/

const Marionette = require('backbone.marionette');
const morphdom = require('morphdom');

Marionette.View.setRenderer(function(template, data) {
    const {el} = this;
    const node = el.cloneNode(false);// shallow clone
    node.innerHTML = template(data);
    morphdom(el, node);
});
