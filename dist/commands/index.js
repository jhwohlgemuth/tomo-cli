"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.array.iterator"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _utils=require("../utils"),_common=require("./common"),_addA11y=require("./add-a11y"),_addBabel=_interopRequireDefault(require("./add-babel")),_addBrowsersync=require("./add-browsersync"),_addCypress=require("./add-cypress"),_addElectron=_interopRequireDefault(require("./add-electron")),_addEsdoc=_interopRequireDefault(require("./add-esdoc")),_addEslint=_interopRequireDefault(require("./add-eslint")),_addJest=_interopRequireDefault(require("./add-jest")),_addMakefile=_interopRequireDefault(require("./add-makefile")),_addMarionette=_interopRequireDefault(require("./add-marionette")),_addParcel=require("./add-parcel"),_addPostcss=require("./add-postcss"),_addReact=_interopRequireDefault(require("./add-react")),_addReason=require("./add-reason"),_addRollup=require("./add-rollup"),_addWebpack=require("./add-webpack"),_createServer=_interopRequireDefault(require("./create-server"));/* eslint-disable no-magic-numbers */const createProject=[..._common.createPackageJson,..._common.createSourceDirectory,..._addBabel.default,..._addEslint.default],create={project:createProject,app:[(0,_utils.withOptions)({browser:!0}),...createProject,..._addPostcss.addPostcss,..._addJest.default,(0,_utils.choose)({default:_addWebpack.addWebpack,useRollup:_addRollup.addRollup,useParcel:_addParcel.addParcel}),(0,_utils.choose)({default:_addMarionette.default,native:[(0,_utils.withOptions)({outputDirectory:"./dist",sourceDirectory:"./renderer/src",assetsDirectory:"./renderer/assets",useReact:!1}),..._addMarionette.default,// Only Marionette.js support, for native react apps, one should probably use ReactNative
..._addElectron.default],useReact:[(0,_utils.withOptions)({useRollup:!1}),// Rollup does not support HMR - it's just not worth using Rollup for a React app.
..._addReact.default]}),(0,_utils.choose)({default:_addBrowsersync.addBrowsersync,useRollup:_addBrowsersync.addBrowsersync,native:[],// do nothing
useParcel:[],// do nothing
useReact:[]// do nothing
})],server:[(0,_utils.withOptions)({browser:!1,sourceDirectory:".",useReact:!1}),..._common.createPackageJson,..._addEslint.default,..._addJest.default,..._createServer.default]},add={a11y:_addA11y.addA11y,babel:_addBabel.default,browsersync:_addBrowsersync.addBrowsersync,cypress:_addCypress.addCypress,electron:_addElectron.default,esdoc:_addEsdoc.default,eslint:[..._addBabel.default,..._addEslint.default],jest:[..._addBabel.default,..._addJest.default],makefile:_addMakefile.default,marionette:_addMarionette.default,parcel:[(0,_utils.withOptions)({useParcel:!0}),..._addBabel.default,..._addParcel.addParcel],postcss:_addPostcss.addPostcss,react:[(0,_utils.withOptions)({useReact:!0}),..._addReact.default],reason:[(0,_utils.withOptions)({useReact:!0}),..._addReason.addReason],rollup:[(0,_utils.withOptions)({useRollup:!0}),..._addBabel.default,..._addRollup.addRollup],webpack:[..._addBabel.default,..._addWebpack.addWebpack]},remove={a11y:_addA11y.removeA11y,browsersync:_addBrowsersync.removeBrowsersync,cypress:_addCypress.removeCypress,parcel:_addParcel.removeParcel,postcss:_addPostcss.removePostcss,reason:_addReason.removeReason,rollup:_addRollup.removeRollup,webpack:_addWebpack.removeWebpack};var _default={add,remove,create,new:create// alias for create
};/**
 * @typedef {Object} task
 * @property {string} text Display text for task
 * @property {function} task Task to execute
 * @property {function} condition Predicate to decide when to execute the task (true) or not (false) - can be async or sync
 * @property {function} [optional] Predicate to decide when to show the task (true) or not (false) - MUST be sync
 */exports.default=_default;