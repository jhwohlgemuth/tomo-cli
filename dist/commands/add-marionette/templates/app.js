"use strict";/**
 * @file Application Core
 * @version 1.0.0
 * @license MIT
 * @module app
 * @exports app
**/const Mn=require("backbone.marionette"),logging=require("./plugins/mn.radio.logging"),state=require("./plugins/mn.redux.state"),Application=Mn.Application.extend({region:"body"});module.exports=Object.assign(new Application,logging,state);