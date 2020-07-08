"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.array.iterator"),require("core-js/modules/es.object.get-own-property-descriptors"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.removeParcel=exports.addParcel=void 0;var _defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty")),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_api=require("../api");function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable})),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var source,i=1;i<arguments.length;i++)source=null==arguments[i]?{}:arguments[i],i%2?ownKeys(Object(source),!0).forEach(function(key){(0,_defineProperty2.default)(target,key,source[key])}):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))});return target}const DISABLED=()=>!1,DEPLOY_SCRIPTS={predeploy:"npm-run-all clean build:es build:css copy:assets",deploy:"echo \"Not yet implemented - now.sh or surge.sh are supported out of the box\" && exit 1"},BUILD_DEPENDENCIES=["cpy-cli","del-cli","npm-run-all"],PARCEL_DEPENDENCIES=["parcel-bundler","parcel-plugin-purgecss"],addParcel=[{text:"Add Parcel build tasks to package.json",task:function(){var _ref=(0,_asyncToGenerator2.default)(function*({assetsDirectory,outputDirectory,port,useReact}){const scripts=_objectSpread(_objectSpread({},DEPLOY_SCRIPTS),{},{clean:`del-cli ${outputDirectory}`,copy:"npm-run-all --parallel copy:assets copy:index","copy:assets":`cpy \"${assetsDirectory}/!(css)/**/*.*\" \"${assetsDirectory}/**/[.]*\" ${outputDirectory} --parents --recursive`,"copy:index":`cpy \"${assetsDirectory}/index.html\" ${outputDirectory}`,"prebuild:es":"npm run clean","build:es":`parcel build --out-dir ${outputDirectory} --public-url ./ ${assetsDirectory}/index.html`,"watch:assets":`watch \"npm run copy\" ${assetsDirectory}`,"prewatch:es":"npm run clean","watch:es":`npm run build:es`,serve:`parcel ${assetsDirectory}/index.html --out-dir ${outputDirectory} --port ${port} --open`,start:"npm-run-all --parallel watch:assets serve"});yield new _api.PackageJsonEditor().extend(useReact?{alias:{"react-dom":"@hot-loader/react-dom"}}:{}).extend({scripts}).commit()});return function task(){return _ref.apply(this,arguments)}}(),condition:()=>(0,_api.allDoExist)("package.json")},{text:"Configure dev task",task:function(){var _ref2=(0,_asyncToGenerator2.default)(function*({skipInstall}){try{yield(0,_api.install)(["stmux"],{dev:!0,skipInstall})}catch(err){yield(0,_api.debug)(err,"Failed to install stmux")}yield new _api.PackageJsonEditor().extend({scripts:{dev:"stmux [ \"npm run watch:es\" : \"npm run lint:ing\" ]"}}).commit()});return function task(){return _ref2.apply(this,arguments)}}(),condition:()=>(0,_api.allDoExist)("package.json",".eslintrc.js"),optional:()=>(0,_api.allDoExistSync)("package.json",".eslintrc.js")},{text:"Create PurgeCSS config file",task:function(){var _ref3=(0,_asyncToGenerator2.default)(function*({assetsDirectory}){yield new _api.PurgecssConfigEditor().create().extend({content:[`'${assetsDirectory}/index.html'`]}).commit()});return function task(){return _ref3.apply(this,arguments)}}(),condition:DISABLED,optional:DISABLED},{text:"Install Parcel development dependencies",task:({skipInstall})=>(0,_api.install)([...BUILD_DEPENDENCIES,...PARCEL_DEPENDENCIES],{dev:!0,skipInstall}),condition:({skipInstall})=>!skipInstall&&(0,_api.allDoExist)("package.json")}];exports.addParcel=addParcel;const removeParcel=[{text:"Remove Parcel build tasks from package.json",task:function(){var _ref4=(0,_asyncToGenerator2.default)(function*(){yield new _api.PackageJsonEditor().extend({scripts:{clean:void 0,copy:void 0,"copy:assets":void 0,"copy:index":void 0,"watch:assets":void 0,dev:void 0,"prebuild:es":void 0,"build:es":void 0,"prewatch:es":void 0,"watch:es":void 0,serve:void 0,start:void 0}}).commit()});return function task(){return _ref4.apply(this,arguments)}}(),condition:()=>(0,_api.allDoExist)("package.json")},{text:"Delete PurgeCSS config file",task:function(){var _ref5=(0,_asyncToGenerator2.default)(function*(){yield new _api.PurgecssConfigEditor().delete().commit()});return function task(){return _ref5.apply(this,arguments)}}(),condition:DISABLED,optional:DISABLED},{text:"Uninstall Parcel dependencies",task:()=>(0,_api.uninstall)([...BUILD_DEPENDENCIES,...PARCEL_DEPENDENCIES,"stmux"]),condition:({skipInstall})=>!skipInstall&&(0,_api.allDoExist)("package.json")&&new _api.PackageJsonEditor().hasAll(...PARCEL_DEPENDENCIES)}];exports.removeParcel=removeParcel;var _default=addParcel;exports.default=_default;