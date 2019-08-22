"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.array.iterator"),require("core-js/modules/es.object.get-own-property-descriptors"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.removeRollup=exports.addRollup=void 0;var _defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty")),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_path=require("path"),_utils=require("../utils"),_common=require("../utils/common");function ownKeys(a,b){var c=Object.keys(a);if(Object.getOwnPropertySymbols){var d=Object.getOwnPropertySymbols(a);b&&(d=d.filter(function(b){return Object.getOwnPropertyDescriptor(a,b).enumerable})),c.push.apply(c,d)}return c}function _objectSpread(a){for(var b,c=1;c<arguments.length;c++)b=null==arguments[c]?{}:arguments[c],c%2?ownKeys(b,!0).forEach(function(c){(0,_defineProperty2.default)(a,c,b[c])}):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(b)):ownKeys(b).forEach(function(c){Object.defineProperty(a,c,Object.getOwnPropertyDescriptor(b,c))});return a}const DEPLOY_SCRIPTS={predeploy:"npm-run-all clean build:es build:css copy:assets",deploy:"echo \"Not yet implemented - now.sh or surge.sh are supported out of the box\" && exit 1"},BUILD_DEPENDENCIES=["cpy-cli","del-cli","npm-run-all"],ROLLUP_DEPENDENCIES=["rollup","rollup-plugin-babel","rollup-plugin-commonjs","rollup-plugin-node-resolve","rollup-plugin-replace","rollup-plugin-terser"],addRollup=[{text:"Create Rollup configuration file",task:function(){var a=(0,_asyncToGenerator2.default)(function*({outputDirectory:a,sourceDirectory:b,useReact:c}){const d=[,`commonjs()`];yield new _utils.RollupConfigEditor().create().prepend(`import {terser} from 'rollup-plugin-terser';`).prepend(`import replace from 'rollup-plugin-replace';`).prepend(`import resolve from 'rollup-plugin-node-resolve';`).prepend(`import commonjs from 'rollup-plugin-commonjs';`).prepend(`import babel from 'rollup-plugin-babel';`).prepend(`/* eslint-disable max-len */`).extend({input:`'${b}/main.js'`,output:{file:`'${a}/bundle.min.js'`}}).extend(c?{plugins:d}:{}).commit()});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_common.allDoNotExist)("webpack.config.js")},{text:"Add Rollup build tasks to package.json",task:function(){var a=(0,_asyncToGenerator2.default)(function*({assetsDirectory:a,outputDirectory:b,sourceDirectory:c}){const d=_objectSpread({},DEPLOY_SCRIPTS,{clean:`del-cli ${b}`,copy:"npm-run-all --parallel copy:assets copy:index","copy:assets":`cpy '${a}/!(css)/**/*.*' '${a}/**/[.]*' ${b} --parents --recursive`,"copy:index":`cpy '${a}/index.html' ${b}`,"prebuild:es":`del-cli ${(0,_path.join)(b,a)}`,"build:es":"rollup -c","postbuild:es":"npm run copy","watch:assets":`watch 'npm run copy' ${a}`,"watch:es":`watch 'npm run build:es' ${c}`});yield new _utils.PackageJsonEditor().extend({scripts:d}).commit()});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_common.allDoExist)("package.json")},{text:"Configure dev task",task:function(){var a=(0,_asyncToGenerator2.default)(function*({skipInstall:a}){yield(0,_utils.install)(["stmux"],{dev:!0,skipInstall:a}),yield new _utils.PackageJsonEditor().extend({scripts:{dev:"stmux [ \"npm run watch:es\" : \"npm run lint:ing\" ]"}}).commit()});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_common.allDoExist)("package.json",".eslintrc.js"),optional:()=>(0,_common.allDoExistSync)("package.json",".eslintrc.js")},{text:"Install Rollup dependencies",task:({skipInstall:a})=>(0,_utils.install)([...BUILD_DEPENDENCIES,...ROLLUP_DEPENDENCIES],{dev:!0,skipInstall:a}),condition:({isNotOffline:a,skipInstall:b})=>!b&&a&&(0,_common.allDoExist)("package.json")}];exports.addRollup=addRollup;const removeRollup=[{text:"Delete Rollup configuration file",task:function(){var a=(0,_asyncToGenerator2.default)(function*(){yield new _utils.RollupConfigEditor().delete().commit()});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_common.allDoExist)("rollup.config.js")},{text:"Remove Rollup build tasks from package.json",task:function(){var a=(0,_asyncToGenerator2.default)(function*(){yield new _utils.PackageJsonEditor().extend({scripts:{copy:void 0,"copy:assets":void 0,"copy:index":void 0,"watch:assets":void 0,dev:void 0,"prebuild:es":void 0,"build:es":void 0,"postbuild:es":void 0,"watch:es":void 0}}).commit()});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_common.allDoExist)("package.json")},{text:"Uninstall Rollup dependencies",task:()=>(0,_utils.uninstall)([...BUILD_DEPENDENCIES,...ROLLUP_DEPENDENCIES,"stmux"]),condition:({skipInstall:a})=>!a&&(0,_common.allDoExist)("package.json")&&new _utils.PackageJsonEditor().hasAll(...ROLLUP_DEPENDENCIES),optional:({skipInstall:a})=>!a}];exports.removeRollup=removeRollup;var _default=addRollup;exports.default=_default;