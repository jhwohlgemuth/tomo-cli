"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.array.iterator"),require("core-js/modules/es.object.get-own-property-descriptors"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.removeWebpack=exports.addWebpack=void 0;var _defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty")),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_path=require("path"),_commonTags=require("common-tags"),_api=require("../api");function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable})),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var source,i=1;i<arguments.length;i++)source=null==arguments[i]?{}:arguments[i],i%2?ownKeys(Object(source),!0).forEach(function(key){(0,_defineProperty2.default)(target,key,source[key])}):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))});return target}const DEPLOY_SCRIPTS={predeploy:"npm-run-all clean \"build:es -- --mode=production\" build:css",deploy:"echo \"Not yet implemented - now.sh or surge.sh are supported out of the box\" && exit 1"},DEV_DEPENDENCIES=["cpy-cli","del-cli","npm-run-all"],DEPENDENCIES=["webpack","webpack-cli","webpack-dashboard","webpack-jarvis","webpack-dev-server","webpack-subresource-integrity","babel-loader","css-loader","file-loader","style-loader","html-webpack-plugin","terser-webpack-plugin","webpack-bundle-analyzer"],WITH_CESIUM_DEPENDENCIES=["copy-webpack-plugin","url-loader"],WITH_RUST_DEPENDENCIES=["@wasm-tool/wasm-pack-plugin"],JAVASCRIPT_RULES=[{test:`/.jsx?$/`,exclude:`/node_modules/`,loader:`'babel-loader'`,options:{presets:[`'@babel/env'`]}}],CSS_RULES=[{test:`/.css$/`,resourceQuery:`/thirdparty/`,use:[`'style-loader'`,`'css-loader'`]},{test:`/.css$/`,exclude:`/node_modules/`,use:[`'style-loader'`,{loader:`'css-loader'`,options:{importLoaders:1}},`'postcss-loader'`]}],FONT_RULES=[{test:`/\\.(woff(2)?|ttf|eot|svg)(\\?v=\\d+\\.\\d+\\.\\d+)?$/`,use:[`'file-loader'`]}],IMAGE_RULES=[{test:`/\.(png|gif|jpg|jpeg|svg|xml|json)$/`,use:[`'url-loader'`]}],RULES=[...JAVASCRIPT_RULES,...CSS_RULES,...FONT_RULES],RULES_WITH_CESIUM=[...RULES,...IMAGE_RULES],CESIUM_DEPENDENCIES=[...WITH_CESIUM_DEPENDENCIES,"cesium"],RESIUM_DEPENDENCIES=[...CESIUM_DEPENDENCIES,"resium"],getAliasOption=(useReact=!1)=>useReact?{"'react-dom'":`'@hot-loader/react-dom'`}:{},getDevServerOption=(outputDirectory,port)=>({port,host:`'0.0.0.0'`,contentBase:`'${outputDirectory}'`,compress:!0,watchContentBase:!0}),getEntryOption=(sourceDirectory,useReact=!1)=>{return useReact?[`...(argv.mode === 'production' ? [] : ['react-hot-loader/patch'])`,`'${sourceDirectory}/main.jsx'`]:{app:`'${sourceDirectory}/main.js'`}},getPlugins=({withCesium,withRust})=>{const PLUGINS=[`new DashboardPlugin()`,(0,_commonTags.oneLineTrim)`new HtmlWebpackPlugin({
            title: \`tomo webapp [\${argv.mode}]\`, 
            template: 'assets/index.html'
        })`,(0,_commonTags.oneLineTrim)`new SriPlugin({
            hashFuncNames: ['sha256'], 
            enabled: argv.mode === 'production'
        })`],WITH_CESIUM=[`new DefinePlugin({CESIUM_BASE_URL: JSON.stringify('/')})`,(0,_commonTags.oneLineTrim)`new CopyWebpackPlugin([
            {from: join(source, 'Workers'), to: 'Workers'},
            {from: join(source, 'ThirdParty'), to: 'ThirdParty'},
            {from: join(source, 'Assets'), to: 'Assets'},
            {from: join(source, 'Widgets'), to: 'Widgets'}
        ])`],WITH_RUST=[(0,_commonTags.oneLineTrim)`new WasmPackPlugin({
            crateDirectory: resolve(__dirname, 'rust-to-wasm'),
            watchDirectories: [
                resolve(__dirname, 'rust-to-wasm', 'src'),
                resolve(__dirname, 'rust-to-wasm', 'tests')
            ],
            forceMode: argv.mode === 'production' ? 'production' : 'development'
        })`];return[...PLUGINS,...(withCesium?WITH_CESIUM:[]),...(withRust?WITH_RUST:[])]},getResolveOption=(sourceDirectory,alias={},useReact=!1)=>({mainFields:`['module', 'main']`,modules:`[resolve(__dirname, '${sourceDirectory}'), 'node_modules']`,extensions:`[${useReact?`'.js', '.jsx'`:`'.js'`}]`,alias}),getRules=({withCesium})=>withCesium?RULES_WITH_CESIUM:RULES,getWebpackConfigPrependContent=({withCesium,withRust})=>[withCesium&&`const source = 'node_modules/cesium/Build/Cesium';`,withRust&&`const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');`,`const TerserPlugin = require('terser-webpack-plugin');`,`const SriPlugin = require('webpack-subresource-integrity');`,`const HtmlWebpackPlugin = require('html-webpack-plugin');`,`const DashboardPlugin = require('webpack-dashboard/plugin');`,withCesium&&`const CopyWebpackPlugin = require('copy-webpack-plugin');`,withCesium&&`const {DefinePlugin} = require('webpack');`,`const {${withCesium?"join, ":""}resolve} = require('path');`,`/* eslint-env node */`]// prepend puts last on top
.filter(val=>"string"==typeof val),addWebpack=[{text:"Create Webpack configuration file",task:function(){var _ref=(0,_asyncToGenerator2.default)(function*({outputDirectory,port,sourceDirectory,useReact,withCesium,withRust}){const alias=getAliasOption(useReact,withCesium),devServer=getDevServerOption(outputDirectory,port),entry=getEntryOption(sourceDirectory,useReact),plugins=getPlugins({withCesium,withRust}),resolve=getResolveOption(sourceDirectory,alias,useReact),rules=getRules({withCesium});yield getWebpackConfigPrependContent({withCesium,withRust}).reduce((config,content)=>config.prepend(content),new _api.WebpackConfigEditor().create()).extend({context:"__dirname",devServer,entry,module:{rules},optimization:{minimize:`argv.mode === 'production'`,minimizer:`[new TerserPlugin()]`},plugins,resolve}).extend(withCesium?{node:{fs:`'empty'`,Buffer:!1,http:`'empty'`,https:`'empty'`,zlib:`'empty'`}}:{}).commit()});return function task(){return _ref.apply(this,arguments)}}(),condition:()=>(0,_api.allDoNotExist)("webpack.config.js")},{text:"Add Webpack build tasks to package.json",task:function(){var _ref2=(0,_asyncToGenerator2.default)(function*({assetsDirectory,outputDirectory,sourceDirectory}){const scripts=_objectSpread(_objectSpread({},DEPLOY_SCRIPTS),{},{clean:`del-cli ${outputDirectory}`,copy:"npm-run-all --parallel copy:assets","copy:assets":`cpy \"${assetsDirectory}/!(css)/**/*.*\" \"${assetsDirectory}/**/[.]*\" ${outputDirectory} --parents --recursive`,"prebuild:es":`del-cli ${(0,_path.join)(outputDirectory,assetsDirectory)}`,"build:es":"webpack","build:stats":"webpack --mode production --profile --json > stats.json","build:analyze":"webpack-bundle-analyzer ./stats.json","postbuild:es":"npm run copy","watch:assets":`watch \"npm run copy\" ${assetsDirectory}`,"watch:es":`watch \"npm run build:es\" ${sourceDirectory}`,dashboard:"webpack-dashboard -- webpack-dev-server --config ./webpack.config.js"});yield new _api.PackageJsonEditor().extend({scripts}).commit()});return function task(){return _ref2.apply(this,arguments)}}(),condition:()=>(0,_api.allDoExist)("package.json")},{text:"Configure dev task",task:function(){var _ref3=(0,_asyncToGenerator2.default)(function*({skipInstall}){try{yield(0,_api.install)(["stmux"],{dev:!0,skipInstall})}catch(err){yield(0,_api.debug)(err,"Failed to install stmux")}yield new _api.PackageJsonEditor().extend({scripts:{dev:"stmux [ \"npm run dashboard\" : \"npm run lint:ing\" ]"}}).commit()});return function task(){return _ref3.apply(this,arguments)}}(),condition:()=>(0,_api.allDoExist)("package.json",".eslintrc.js"),optional:()=>(0,_api.allDoExistSync)("package.json",".eslintrc.js")},{text:"Install Webpack and development dependencies",task:({skipInstall})=>(0,_api.install)([...DEV_DEPENDENCIES,...DEPENDENCIES],{dev:!0,skipInstall}),condition:({isNotOffline,skipInstall})=>!skipInstall&&isNotOffline&&(0,_api.allDoExist)("package.json")},{text:"Install Cesium dependencies",task:({skipInstall,useReact})=>(0,_api.install)(useReact?RESIUM_DEPENDENCIES:CESIUM_DEPENDENCIES,{skipInstall}),condition:({withCesium})=>withCesium,optional:({withCesium})=>withCesium},{text:"Install Rust dependencies",task:({skipInstall})=>(0,_api.install)(WITH_RUST_DEPENDENCIES,{dev:!0,skipInstall}),condition:({withRust})=>withRust,optional:({withRust})=>withRust}];exports.addWebpack=addWebpack;const removeWebpack=[{text:"Delete Webpack configuration file",task:function(){var _ref4=(0,_asyncToGenerator2.default)(function*(){yield new _api.WebpackConfigEditor().delete().commit()});return function task(){return _ref4.apply(this,arguments)}}(),condition:()=>(0,_api.allDoExist)("webpack.config.js")},{text:"Remove Webpack build tasks from package.json",task:function(){var _ref5=(0,_asyncToGenerator2.default)(function*(){yield new _api.PackageJsonEditor().extend({scripts:{copy:void 0,"copy:assets":void 0,"copy:index":void 0,"watch:assets":void 0,dev:void 0,"prebuild:es":void 0,"build:es":void 0,"postbuild:es":void 0,"watch:es":void 0,dashboard:void 0,predeploy:void 0,deploy:void 0}}).commit()});return function task(){return _ref5.apply(this,arguments)}}(),condition:()=>(0,_api.allDoExist)("package.json")},{text:"Uninstall Webpack dependencies",task:()=>(0,_api.uninstall)([...DEV_DEPENDENCIES,...DEPENDENCIES,"stmux"]),condition:({skipInstall})=>!skipInstall&&(0,_api.allDoExist)("package.json")&&new _api.PackageJsonEditor().hasAll(...DEPENDENCIES),optional:({skipInstall})=>!skipInstall},{text:"Uninstall Cesium Webpack dependencies",task:()=>(0,_api.uninstall)(WITH_CESIUM_DEPENDENCIES),condition:({skipInstall})=>!skipInstall&&(0,_api.allDoExist)("package.json")&&new _api.PackageJsonEditor().hasAll(...WITH_CESIUM_DEPENDENCIES),//eslint-disable-line max-len
optional:({skipInstall,withCesium})=>!skipInstall&&withCesium},{text:"Uninstall Rust Webpack dependencies",task:()=>(0,_api.uninstall)(WITH_RUST_DEPENDENCIES),condition:({skipInstall})=>!skipInstall&&(0,_api.allDoExist)("package.json")&&new _api.PackageJsonEditor().hasAll(...WITH_RUST_DEPENDENCIES),//eslint-disable-line max-len
optional:({skipInstall,withRust})=>!skipInstall&&withRust}];exports.removeWebpack=removeWebpack;var _default=addWebpack;exports.default=_default;