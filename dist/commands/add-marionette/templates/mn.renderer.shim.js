"use strict";/**
 * @file Shim Marionette template renderer to use morphdom
 * Other options include: inferno, snabbdom, rivets, idom and virtual-dom
 * @see https://github.com/blikblum/marionette.renderers
**/const Marionette=require("backbone.marionette"),morphdom=require("morphdom");Marionette.View.setRenderer(function(a,b){const{el:c}=this,d=c.cloneNode(!1);// shallow clone
d.innerHTML=a(b),morphdom(c,d)});