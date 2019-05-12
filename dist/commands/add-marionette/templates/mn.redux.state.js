"use strict";/**
 * @file Add Redux store to application
 * @description Features:
 * - Enhanced getState that accepts path parameter
 * - "dispatch logging" middleware
 * - Basic reducer showcasing how to leverage lodash for updating state
 * @module plugins/redux.state
 * @example <caption>Extend application object</caption>
 * var state = require('./plugins/redux.state');
 * var app = new Marionette.Application();
 * module.exports = Object.assign(app, state);
 * @example <caption>Enhanced getState accepts path parameter</caption>
 * app.getState();// {name: 'omaha-project', count: 42}
 * app.getState('count');// 42
 * @example <caption>Update state with Redux API</caption>
 * app.getState('count');// 42
 * app.dispatch({type: 'INCREMENT'});
 * app.getState('count');// 43
**/const{get,update}=require("lodash"),{applyMiddleware,compose,createStore}=require("redux"),initialState={name:"omaha-project",count:42};module.exports=createStore(reducer,initialState,compose(applyMiddleware(dispatchLogger),addGetStatePathParameter()));// state reducer
function reducer(a,b){switch(b.type){case"INCREMENT":return update(a,"count",increment);case"DECREMENT":return update(a,"count",decrement);default:return a;}}// middleware
function dispatchLogger(){return a=>b=>// console.log(`Dispatch: ${action.type}`);
a(b)}// store enhancer
function addGetStatePathParameter(){return a=>(b,c,d)=>{const e=a(b,c,d),{dispatch:f,subscribe:g}=e;return{getState:a=>"string"==typeof a?get(e.getState(),a):e.getState(),dispatch:f,subscribe:g}}}// pure functions
function increment(a){return a+1}function decrement(a){return a-1}