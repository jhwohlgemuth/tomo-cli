"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.array.iterator"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.removeReason=exports.addReason=void 0;var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_path=require("path"),_utils=require("../../utils"),_common=require("../../utils/common"),_Scaffolder=require("../../utils/Scaffolder");const DEPENDENCIES=["reason-react"],DEV_DEPENDENCIES=["bs-platform"],addReason=[{text:"Create bsconfig.json file",task:function(){var a=(0,_asyncToGenerator2.default)(function*(){const{name:a}=new _utils.PackageJsonEditor().read();yield new _utils.BsConfigJsonEditor().create().extend({name:a}).commit()});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_common.allDoNotExist)("bsconfig.json")},{text:"Add Reason scripts to package.json",task:function(){var a=(0,_asyncToGenerator2.default)(function*(){yield new _utils.PackageJsonEditor().extend({scripts:{"build:reason":"bsb -make-world -clean-world","watch:reason":"npm run build:reason -- -w"}}).commit()});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_common.allDoExist)("package.json")},{text:"Install ReasonReact dependencies",task:function(){var a=(0,_asyncToGenerator2.default)(function*({skipInstall:a}){yield(0,_utils.install)(DEPENDENCIES,{skipInstall:a}),yield(0,_utils.install)(DEV_DEPENDENCIES,{dev:!0,skipInstall:a})});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_common.allDoExist)("package.json")},{text:"Copy ReasonReact boilerplate files",task:function(){var a=(0,_asyncToGenerator2.default)(function*({overwrite:a,sourceDirectory:b}){yield new _Scaffolder.Scaffolder((0,_path.join)(__dirname,"templates")).overwrite(a).target(`${b}/components`).copy("App.re").copy("Example.re").commit()});return function task(){return a.apply(this,arguments)}}(),condition:({useReact:a})=>a,optional:({useReact:a})=>a},{text:"Configure Webpack Reason support",task:function(){var a=(0,_asyncToGenerator2.default)(function*(){});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_common.allDoExist)("webpack.config.js"),optional:()=>(0,_common.allDoExistSync)("webpack.config.js")},{text:"Configure Parcel.js Reason support",task:function(){var a=(0,_asyncToGenerator2.default)(function*(){});return function task(){return a.apply(this,arguments)}}(),condition:({useParcel:a})=>a||(0,_common.allDoNotExist)("webpack.config.js","rollup.config.js"),optional:({useParcel:a})=>a||(0,_common.allDoNotExistSync)("webpack.config.js","rollup.config.js")},{text:"Configure Rollup.js Reason support",task:function(){var a=(0,_asyncToGenerator2.default)(function*(){});return function task(){return a.apply(this,arguments)}}(),condition:({useRollup:a})=>a||(0,_common.allDoExist)("rollup.config.js"),optional:({useRollup:a})=>a||(0,_common.allDoExistSync)("rollup.config.js")}];exports.addReason=addReason;const removeReason=[{text:"Remove Reason scripts from package.json",task:function(){var a=(0,_asyncToGenerator2.default)(function*(){yield new _utils.PackageJsonEditor().extend({scripts:{"build:reason":void 0,"watch:reason":void 0}}).commit()});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_common.allDoExist)("package.json")},{text:"Uninstall Reason dependencies",task:()=>(0,_utils.uninstall)([...DEPENDENCIES,...DEV_DEPENDENCIES]),condition:({skipInstall:a})=>!a&&(0,_common.allDoExist)("package.json")&&new _utils.PackageJsonEditor().hasAll(...DEPENDENCIES,...DEV_DEPENDENCIES)// eslint-disable-line max-len
}];exports.removeReason=removeReason;var _default=addReason;exports.default=_default;