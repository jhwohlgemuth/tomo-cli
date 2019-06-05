"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.tasks=void 0;var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_path=require("path"),_utils=require("../../utils"),_common=require("../../utils/common"),_Scaffolder=require("../../utils/Scaffolder");const DEPENDENCIES=["electron","electron-context-menu","electron-debug","electron-is-dev"],DEV_DEPENDENCIES=["electron-reloader","npm-run-all","spectron"],ALWAYS=()=>!0,sourceDirectory=(0,_path.join)(__dirname,"templates"),scaffolder=new _Scaffolder.Scaffolder({sourceDirectory}),tasks=[{text:"Copy electron application files",task:function(){var a=(0,_asyncToGenerator2.default)(function*(){yield scaffolder.target(".").copy("index.js").target("bin").copy("preload.js").commit()});return function task(){return a.apply(this,arguments)}}(),condition:ALWAYS},{text:"Configure metadata and add tasks to package.json",task:function(){var a=(0,_asyncToGenerator2.default)(function*(){yield new _utils.PackageJsonEditor().extend({description:"Native Desktop application built with Electron",main:"index.js",name:"tomo-native-app",scripts:{"preelectron:start":"npm run build","electron:start":"electron index","electron:dev":"npm run electron:start -- --enable-logging"}}).commit()});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_common.allDoExist)("package.json")},{text:"Install electron dependencies",task:function(){var a=(0,_asyncToGenerator2.default)(function*({skipInstall:a}){yield(0,_utils.install)(DEPENDENCIES,{skipInstall:a}),yield(0,_utils.install)(DEV_DEPENDENCIES,{dev:!0,skipInstall:a})});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_common.allDoExist)("package.json")}];exports.tasks=tasks;var _default=tasks;exports.default=_default;