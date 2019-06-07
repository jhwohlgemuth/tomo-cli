"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.array.iterator"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.removePostcss=exports.addPostcss=void 0;var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_utils=require("../utils"),_common=require("../utils/common");const POSTCSS_DEPENDENCIES=["cssnano","postcss-cli","postcss-normalize","postcss-reporter","postcss-safe-parser","postcss-import","postcss-preset-env","stylelint","stylelint-config-recommended","uncss"],addPostcss=[{text:"Create PostCSS config file",task:function(){var a=(0,_asyncToGenerator2.default)(function*({outputDirectory:a,useParcel:b}){const c=[`require('stylelint')({config: {extends: 'stylelint-config-recommended'}})`,...(b?[]:[`require('uncss').postcssPlugin({html: ['${a}/index.html']})`]),`require('postcss-import')()`,`require('postcss-preset-env')({stage: 0})`,`require('postcss-normalize')({browsers: 'last 2 versions'})`,`require('cssnano')()`,`require('postcss-reporter')({clearReportedMessages: true})`];yield new _utils.PostcssConfigEditor().create().extend({plugins:c}).commit()});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_common.allDoNotExist)("postcss.config.js")},{text:"Add PostCSS tasks to package.json",task:function(){var a=(0,_asyncToGenerator2.default)(function*({assetsDirectory:a,outputDirectory:b}){yield new _utils.PackageJsonEditor().extend({scripts:{"build:css":`postcss ${a}/css/style.css --dir ${b}`,"build:css:watch":"npm run build:css -- --watch"}}).commit()});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_common.someDoExist)("package.json")},{text:"Install PostCSS dependencies",task:({skipInstall:a})=>(0,_utils.install)(POSTCSS_DEPENDENCIES,{dev:!0,skipInstall:a}),condition:({isNotOffline:a})=>a&&(0,_common.someDoExist)("package.json")}];/**
 * @type {task[]}
 * @see https://github.com/postcss/postcss
 */exports.addPostcss=addPostcss;const removePostcss=[{text:"Delete PostCSS config file",task:function(){var a=(0,_asyncToGenerator2.default)(function*(){yield new _utils.PostcssConfigEditor().delete().commit()});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_common.someDoExist)("postcss.config.js")},{text:"Remove PostCSS build task from package.json",task:function(){var a=(0,_asyncToGenerator2.default)(function*(){yield new _utils.PackageJsonEditor().extend({scripts:{"build:css":void 0,"build:css:watch":void 0}}).commit()});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_common.someDoExist)("package.json")},{text:"Uninstall PostCSS dependencies",task:()=>(0,_utils.uninstall)(POSTCSS_DEPENDENCIES),condition:({skipInstall:a})=>!a&&(0,_common.someDoExist)("package.json")&&new _utils.PackageJsonEditor().hasAll(...POSTCSS_DEPENDENCIES),optional:({skipInstall:a})=>!a}];exports.removePostcss=removePostcss;var _default=addPostcss;exports.default=_default;