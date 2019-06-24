"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.array.iterator"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.removeParcel=exports.addParcel=void 0;var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_utils=require("../utils"),_common=require("../utils/common");const BUILD_DEPENDENCIES=["cpy-cli","del-cli","npm-run-all"],PARCEL_DEPENDENCIES=["parcel-bundler","parcel-plugin-purgecss"],addParcel=[{text:"Add Parcel build tasks to package.json",task:function(){var a=(0,_asyncToGenerator2.default)(function*({assetsDirectory:a,outputDirectory:b,port:c,useReact:d}){yield new _utils.PackageJsonEditor().extend(d?{alias:{"react-dom":"@hot-loader/react-dom"}}:{}).extend({scripts:{clean:`del-cli ${b}`,copy:"npm-run-all --parallel copy:assets copy:index","copy:assets":`cpy '${a}/!(css)/**/*.*' '${a}/**/[.]*' ${b} --parents --recursive`,"copy:index":`cpy '${a}/index.html' ${b}`,"watch:assets":`watch 'npm run copy' ${a}`,"prebuild:es":"npm run clean","build:es":`parcel build --out-dir ${b} --public-url ./ ${a}/index.html`,"prewatch:es":"npm run clean","watch:es":`npm run build:es`,serve:`parcel ${a}/index.html --out-dir ${b} --port ${c} --open`,start:"npm-run-all --parallel watch:assets serve"}}).commit()});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_common.allDoExist)("package.json")},{text:"Install development dependencies and add dev task to package.json",task:function(){var a=(0,_asyncToGenerator2.default)(function*({skipInstall:a}){yield(0,_utils.install)(["stmux"],{dev:!0,skipInstall:a}),yield new _utils.PackageJsonEditor().extend({scripts:{dev:"stmux [ \"npm run watch:es\" : \"npm run lint:ing\" ]"}}).commit()});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_common.allDoExist)("package.json",".eslintrc.js"),optional:()=>(0,_common.allDoExistSync)("package.json",".eslintrc.js")},{text:"Create PurgeCSS config file",task:function(){var a=(0,_asyncToGenerator2.default)(function*({assetsDirectory:a}){yield new _utils.PurgecssConfigEditor().create().extend({content:[`'${a}/index.html'`]}).commit()});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_common.allDoNotExist)("purgecss.config.js")},{text:"Install Parcel development dependencies",task:({skipInstall:a})=>(0,_utils.install)([...BUILD_DEPENDENCIES,...PARCEL_DEPENDENCIES],{dev:!0,skipInstall:a}),condition:({isNotOffline:a})=>a&&(0,_common.allDoExist)("package.json")}];exports.addParcel=addParcel;const removeParcel=[{text:"Remove Parcel build tasks from package.json",task:function(){var a=(0,_asyncToGenerator2.default)(function*(){yield new _utils.PackageJsonEditor().extend({scripts:{clean:void 0,copy:void 0,"copy:assets":void 0,"copy:index":void 0,"watch:assets":void 0,dev:void 0,"prebuild:es":void 0,"build:es":void 0,"prewatch:es":void 0,"watch:es":void 0,serve:void 0,start:void 0}}).commit()});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_common.allDoExist)("package.json")},{text:"Delete PurgeCSS config file",task:function(){var a=(0,_asyncToGenerator2.default)(function*(){yield new _utils.PurgecssConfigEditor().delete().commit()});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_common.allDoExist)("purgecss.config.js")},{text:"Uninstall Parcel dependencies",task:()=>(0,_utils.uninstall)([...BUILD_DEPENDENCIES,...PARCEL_DEPENDENCIES,"stmux"]),condition:({skipInstall:a})=>!a&&(0,_common.allDoExist)("package.json")&&new _utils.PackageJsonEditor().hasAll(...PARCEL_DEPENDENCIES),optional:({skipInstall:a})=>!a}];exports.removeParcel=removeParcel;var _default=addParcel;exports.default=_default;