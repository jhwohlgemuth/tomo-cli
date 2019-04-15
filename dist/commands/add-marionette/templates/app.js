"use strict";

/**
 * @file Application Core
 * @version 1.0.0
 * @license MIT
 * @module app
 * @exports app
**/
const Mn = require('backbone.marionette');

const logging = require('./plugins/mn.radio.logging');

const state = require('./plugins/mn.redux.state'); // require('./shims/mn.renderer.shim');


const Application = Mn.Application.extend({
  region: 'body'
});
module.exports = Object.assign(new Application(), logging, state);