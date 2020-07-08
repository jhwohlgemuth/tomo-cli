"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.removeA11y=exports.addA11y=void 0;var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_api=require("../api");/**
 * @type {task[]}
 * @see http://pa11y.org/
 */const addA11y=[{text:"Add accessibility tasks to package.json",task:function(){var _ref=(0,_asyncToGenerator2.default)(function*({outputDirectory}){yield new _api.PackageJsonEditor().extend({scripts:{"lint:aria":`pa11y ${outputDirectory}/index.html`}}).commit()});return function task(){return _ref.apply(this,arguments)}}(),condition:()=>(0,_api.allDoExist)("package.json")},{text:"Install pa11y for checking accessibility rules",task:({skipInstall})=>(0,_api.install)(["pa11y"],{dev:!0,skipInstall}),condition:({skipInstall})=>!skipInstall&&(0,_api.allDoExist)("package.json")}];exports.addA11y=addA11y;const removeA11y=[{text:"Remove accessibility tasks from package.json",task:function(){var _ref2=(0,_asyncToGenerator2.default)(function*(){yield new _api.PackageJsonEditor().extend({scripts:{"lint:aria":void 0}}).commit()});return function task(){return _ref2.apply(this,arguments)}}(),condition:()=>(0,_api.allDoExist)("package.json")},{text:"Uninstall pa11y",task:()=>(0,_api.uninstall)(["pa11y"]),condition:()=>(0,_api.allDoExist)("package.json")&&new _api.PackageJsonEditor().hasAll("pa11y")}];exports.removeA11y=removeA11y;var _default=addA11y;exports.default=_default;