"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.array.iterator"),require("core-js/modules/es.string.split"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.tasks=void 0;var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_path=require("path"),_api=require("../../api");const MARIONETTE_DEPENDENCIES=["jquery","backbone","backbone.marionette","backbone.radio","marionette.approuter","lit-html","lodash-es","redux"],ALWAYS=/*#__PURE__*/function(){var _ref=(0,_asyncToGenerator2.default)(function*(){return!0});return function(){return _ref.apply(this,arguments)}}(),tasks=[{text:"Copy Marionette.js boilerplate and assets",task:function(){var _ref2=(0,_asyncToGenerator2.default)(function*({assetsDirectory,overwrite,sourceDirectory,useParcel,useRollup,useSnowpack}){const inPlace=useParcel||useSnowpack?"-in-place":"",index=`index${inPlace}${useRollup?"-rollup":""}.html`,format=filename=>{const[name,extension]=filename.split(".");return`${name}${useSnowpack?"-snowpack":""}.${extension}`};yield new _api.Scaffolder((0,_path.join)(__dirname,"templates")).overwrite(overwrite).target(sourceDirectory).copy("main.js").target(`${sourceDirectory}/components`).copy("app.js").copy("header.js").copy(format("body.js"),"body.js").copy("footer.js").target(`${sourceDirectory}/shims`).copy("mn.renderer.shim.js").target(`${sourceDirectory}/plugins`).copy("mn.radio.logging.js").copy("mn.redux.state.js").commit(),yield new _api.Scaffolder((0,_path.join)(__dirname,"..","common","templates")).overwrite(overwrite).target(".").copy("gitignore",".gitignore").target(`${assetsDirectory}`).copy(index,"index.html").target(`${assetsDirectory}/css`).copy(format("style.css"),"style.css").copy(`fonts${inPlace}.css`,"fonts.css").target(`${assetsDirectory}/images`).copy("blank_canvas.png").copy("preferences.png").target(`${assetsDirectory}/fonts`).copy("SansForgetica-Regular.eot").copy("SansForgetica-Regular.svg").copy("SansForgetica-Regular.ttf").copy("SansForgetica-Regular.woff").copy("SansForgetica-Regular.woff2").target(`${assetsDirectory}/library`).copy(".gitkeep").target(`${assetsDirectory}/workers`).copy(".gitkeep").commit()});return function task(){return _ref2.apply(this,arguments)}}(),condition:ALWAYS},{text:"Copy Rust boilerplate",task:function(){var _ref3=(0,_asyncToGenerator2.default)(function*({overwrite}){yield new _api.Scaffolder((0,_path.join)(__dirname,"..","common","templates")).overwrite(overwrite).target(".").copy("Cargo.toml").target("rust-to-wasm").copy("Cargo_crate.toml","Cargo.toml").target("rust-to-wasm/src").copy("lib.rs").copy("utils.rs").target("rust-to-wasm/tests").copy("app.rs").copy("web.rs").commit()});return function task(){return _ref3.apply(this,arguments)}}(),condition:({withRust})=>withRust,optional:({withRust})=>withRust},{text:"Set package.json \"main\" attribute",task:function(){var _ref4=(0,_asyncToGenerator2.default)(function*({sourceDirectory}){yield new _api.PackageJsonEditor().extend({main:`${sourceDirectory}/main.js`}).commit()});return function task(){return _ref4.apply(this,arguments)}}(),condition:()=>(0,_api.allDoExist)("package.json")},{text:"Install Marionette.js dependencies",task:({skipInstall})=>(0,_api.install)(MARIONETTE_DEPENDENCIES,{skipInstall}),condition:({skipInstall})=>!skipInstall&&(0,_api.allDoExist)("package.json")}];exports.tasks=tasks;var _default=tasks;exports.default=_default;