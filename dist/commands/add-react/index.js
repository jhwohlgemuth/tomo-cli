"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.array.iterator"),require("core-js/modules/es.object.get-own-property-descriptors"),require("core-js/modules/es.string.split"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.addReact=void 0;var _defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty")),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_path=require("path"),_api=require("../../api");function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable})),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var source,i=1;i<arguments.length;i++)source=null==arguments[i]?{}:arguments[i],i%2?ownKeys(Object(source),!0).forEach(function(key){(0,_defineProperty2.default)(target,key,source[key])}):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))});return target}const DEV_DEPENDENCIES=["npm-run-all"],ALWAYS=()=>!0,addReact=[{text:"Copy React boilerplate and assets",task:function(){var _ref=(0,_asyncToGenerator2.default)(function*({assetsDirectory,sourceDirectory,overwrite,useParcel,useSnowpack}){const inPlace=useParcel||useSnowpack?"-in-place":"",index=`index${inPlace}-react${useSnowpack?"-snowpack":""}.html`,format=filename=>{const[name,extension]=filename.split(".");return`${name}${useSnowpack?"-snowpack":""}.${extension}`};yield new _api.Scaffolder((0,_path.join)(__dirname,"templates")).overwrite(overwrite).target(sourceDirectory).copy(format("main.js"),`main.js${useSnowpack?"":"x"}`).target(`${sourceDirectory}/components`).copy(format("App.js"),"App.jsx").copy(format("Header.js"),"Header.jsx").copy(format("Body.js"),"Body.jsx").copy(format("Footer.js"),"Footer.jsx").commit(),yield new _api.Scaffolder((0,_path.join)(__dirname,"..","common","templates")).overwrite(overwrite).target(".").copy("gitignore",".gitignore").target(`${assetsDirectory}`).copy(index,"index.html").target(`${assetsDirectory}/css`).copy(format("style.css"),"style.css").copy(`fonts${inPlace}.css`,"fonts.css").target(`${assetsDirectory}/images`).copy("react.png").copy("preferences.png").target(`${assetsDirectory}/fonts`).copy("SansForgetica-Regular.eot").copy("SansForgetica-Regular.svg").copy("SansForgetica-Regular.ttf").copy("SansForgetica-Regular.woff").copy("SansForgetica-Regular.woff2").target(`${assetsDirectory}/library`).copy(".gitkeep").target(`${assetsDirectory}/workers`).copy(".gitkeep").commit()});return function task(){return _ref.apply(this,arguments)}}(),condition:ALWAYS},{text:"Copy Rust boilerplate",task:function(){var _ref2=(0,_asyncToGenerator2.default)(function*({overwrite}){yield new _api.Scaffolder((0,_path.join)(__dirname,"..","common","templates")).overwrite(overwrite).target(".").copy("Cargo.toml").target("rust-to-wasm").copy("Cargo_crate.toml","Cargo.toml").target("rust-to-wasm/src").copy("lib.rs").copy("utils.rs").target("rust-to-wasm/tests").copy("app.rs").copy("web.rs").commit()});return function task(){return _ref2.apply(this,arguments)}}(),condition:({withRust})=>withRust,optional:({withRust})=>withRust},{text:"Set package.json \"main\" attribute and add scripts tasks",task:function(){var _ref3=(0,_asyncToGenerator2.default)(function*({sourceDirectory,useParcel,useRollup,useSnowpack}){const watches={"watch:es":useRollup?`watch \"npm run build:es\" ${sourceDirectory}`:"webpack serve --hot --open --mode development"},scripts=_objectSpread(_objectSpread({},useSnowpack?{}:watches),{},{start:useSnowpack?"snowpack dev":"npm-run-all build:es --parallel watch:*"});yield new _api.PackageJsonEditor().extend({main:`${sourceDirectory}/main.js`}).extend(useParcel?{}:{scripts}).commit()});return function task(){return _ref3.apply(this,arguments)}}(),condition:()=>(0,_api.allDoExist)("package.json")},{text:"Install React dependencies",task:function(){var _ref4=(0,_asyncToGenerator2.default)(function*({legacyNpm,reactVersion,skipInstall,useSnowpack}){const dependencies=["prop-types",`react@${reactVersion}`,`react-dom@${reactVersion}`,"wouter",// https://github.com/molefrog/wouter
...(useSnowpack?[]:["@hot-loader/react-dom"])];yield(0,_api.install)(dependencies,{latest:!1,legacy:legacyNpm,skipInstall}),yield(0,_api.install)(DEV_DEPENDENCIES,{dev:!0,skipInstall})});return function task(){return _ref4.apply(this,arguments)}}(),condition:({skipInstall})=>!skipInstall&&(0,_api.allDoExist)("package.json")}];exports.addReact=addReact;var _default=addReact;exports.default=_default;