"use strict";/* eslint-env browser */ /**
 * @file Main entry point for application
 * @requires app
**/const Backbone=require("backbone"),Mn=require("backbone.marionette"),AppRouter=require("marionette.approuter"),app=require("./app"),name=app.getState("name"),RouterController=Mn.MnObject.extend({foo:function(){// code to be executed for 'foo' route
}}),Router=AppRouter.extend({appRoutes:{foo:"foo"},controller:new RouterController}),ExampleModel=Backbone.Model.extend({defaults:{name}}),View=Mn.View.extend({// view code goes here
template:`<div>Hello world</div>`,model:new ExampleModel});app.on("before:start",()=>{app.info(`${name} is starting...`),app.router=new Router}),app.on("start",()=>{Backbone.history.start(),app.info(`${name} is started!`),app.getRegion().show(new View)}),document.addEventListener("DOMContentLoaded",()=>app.start());