"use strict";/**
 * This shim replaces lodash template functions with Handlebars.js
 * (not needed if templates are pre-compiled)
**/const Marionette=require("backbone.marionette"),Handlebars=require("handlebars");//Override MarionetteJS template retrieval & compilation to use Handlebars.js
Marionette.TemplateCache.prototype.loadTemplate=function(a){// Pass straight through to compileTemplate function
return a},Marionette.TemplateCache.prototype.compileTemplate=function(a){//If you use pre-compiled Handlebars templates, you can simply return rawTemplate
return Handlebars.compile(a)};