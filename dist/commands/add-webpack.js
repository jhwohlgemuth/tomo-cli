"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.array.iterator"),require("core-js/modules/es.object.get-own-property-descriptors"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.removeWebpack=exports.addWebpack=void 0;var _defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty")),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_path=require("path"),_commonTags=require("common-tags"),_api=require("../api");function ownKeys(a,b){var c=Object.keys(a);if(Object.getOwnPropertySymbols){var d=Object.getOwnPropertySymbols(a);b&&(d=d.filter(function(b){return Object.getOwnPropertyDescriptor(a,b).enumerable})),c.push.apply(c,d)}return c}function _objectSpread(a){for(var b,c=1;c<arguments.length;c++)b=null==arguments[c]?{}:arguments[c],c%2?ownKeys(Object(b),!0).forEach(function(c){(0,_defineProperty2.default)(a,c,b[c])}):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(b)):ownKeys(Object(b)).forEach(function(c){Object.defineProperty(a,c,Object.getOwnPropertyDescriptor(b,c))});return a}const DEPLOY_SCRIPTS={predeploy:"npm-run-all clean \"build:es -- --mode=production\" build:css",deploy:"echo \"Not yet implemented - now.sh or surge.sh are supported out of the box\" && exit 1"},DEV_DEPENDENCIES=["cpy-cli","del-cli","npm-run-all"],DEPENDENCIES=["webpack","webpack-cli","webpack-dashboard","webpack-jarvis","webpack-dev-server","webpack-subresource-integrity","babel-loader","css-loader","file-loader","style-loader","html-webpack-plugin","terser-webpack-plugin","webpack-bundle-analyzer"],WITH_CESIUM_DEPENDENCIES=["copy-webpack-plugin","url-loader"],WITH_RUST_DEPENDENCIES=["@wasm-tool/wasm-pack-plugin"],JAVASCRIPT_RULES=[{test:`/.jsx?$/`,exclude:`/node_modules/`,loader:`'babel-loader'`,options:{presets:[`'@babel/env'`]}}],CSS_RULES=[{test:`/.css$/`,resourceQuery:`/thirdparty/`,use:[`'style-loader'`,`'css-loader'`]},{test:`/.css$/`,exclude:`/node_modules/`,use:[`'style-loader'`,{loader:`'css-loader'`,options:{importLoaders:1}},`'postcss-loader'`]}],FONT_RULES=[{test:`/\\.(woff(2)?|ttf|eot|svg)(\\?v=\\d+\\.\\d+\\.\\d+)?$/`,use:[`'file-loader'`]}],IMAGE_RULES=[{test:`/\.(png|gif|jpg|jpeg|svg|xml|json)$/`,use:[`'url-loader'`]}],RULES=[...JAVASCRIPT_RULES,...CSS_RULES,...FONT_RULES],RULES_WITH_CESIUM=[...RULES,...IMAGE_RULES],CESIUM_DEPENDENCIES=[...WITH_CESIUM_DEPENDENCIES,"cesium"],RESIUM_DEPENDENCIES=[...CESIUM_DEPENDENCIES,"resium"],getAliasOption=(a=!1)=>a?{"'react-dom'":`'@hot-loader/react-dom'`}:{},getDevServerOption=(a,b)=>({port:b,host:`'0.0.0.0'`,contentBase:`'${a}'`,compress:!0,watchContentBase:!0}),getEntryOption=(a,b=!1)=>{return b?[`...(argv.mode === 'production' ? [] : ['react-hot-loader/patch'])`,`'${a}/main.jsx'`]:{app:`'${a}/main.js'`}},getPlugins=({withCesium:a,withRust:b})=>{const c=[`new DashboardPlugin()`,_commonTags.oneLineTrim`new HtmlWebpackPlugin({
            title: \`tomo webapp [\${argv.mode}]\`, 
            template: 'assets/index.html'
        })`,_commonTags.oneLineTrim`new SriPlugin({
            hashFuncNames: ['sha256'], 
            enabled: argv.mode === 'production'
        })`],d=[`new DefinePlugin({CESIUM_BASE_URL: JSON.stringify('/')})`,_commonTags.oneLineTrim`new CopyWebpackPlugin([
            {from: join(source, 'Workers'), to: 'Workers'},
            {from: join(source, 'ThirdParty'), to: 'ThirdParty'},
            {from: join(source, 'Assets'), to: 'Assets'},
            {from: join(source, 'Widgets'), to: 'Widgets'}
        ])`],e=[_commonTags.oneLineTrim`new WasmPackPlugin({
            crateDirectory: resolve(__dirname, 'rust-to-wasm'),
            watchDirectories: [
                resolve(__dirname, 'rust-to-wasm', 'src'),
                resolve(__dirname, 'rust-to-wasm', 'tests')
            ],
            forceMode: argv.mode === 'production' ? 'production' : 'development'
        })`];return[...c,...(a?d:[]),...(b?e:[])]},getResolveOption=(a,b={},c=!1)=>({mainFields:`['module', 'main']`,modules:`[resolve(__dirname, '${a}'), 'node_modules']`,extensions:`[${c?`'.js', '.jsx'`:`'.js'`}]`,alias:b}),getRules=({withCesium:a})=>a?RULES_WITH_CESIUM:RULES,getWebpackConfigPrependContent=a=>[a&&`const source = 'node_modules/cesium/Build/Cesium';`,`const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');`,`const TerserPlugin = require('terser-webpack-plugin');`,`const SriPlugin = require('webpack-subresource-integrity');`,`const HtmlWebpackPlugin = require('html-webpack-plugin');`,`const DashboardPlugin = require('webpack-dashboard/plugin');`,a&&`const CopyWebpackPlugin = require('copy-webpack-plugin');`,a&&`const {DefinePlugin} = require('webpack');`,`const {${a?"join, ":""}resolve} = require('path');`,`/* eslint-env node */`]// prepend puts last on top
.filter(a=>"string"==typeof a),addWebpack=[{text:"Create Webpack configuration file",task:function(){var a=(0,_asyncToGenerator2.default)(function*({outputDirectory:a,port:b,sourceDirectory:c,useReact:d,withCesium:e,withRust:f}){const g=getAliasOption(d,e),h=getDevServerOption(a,b),i=getEntryOption(c,d),j=getPlugins({withCesium:e,withRust:f}),k=getResolveOption(c,g,d),l=getRules({withCesium:e});yield getWebpackConfigPrependContent(e).reduce((a,b)=>a.prepend(b),new _api.WebpackConfigEditor().create()).extend({context:"__dirname",devServer:h,entry:i,module:{rules:l},optimization:{minimize:`argv.mode === 'production'`,minimizer:`[new TerserPlugin()]`},plugins:j,resolve:k}).extend(e?{node:{fs:`'empty'`,Buffer:!1,http:`'empty'`,https:`'empty'`,zlib:`'empty'`}}:{}).commit()});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_api.allDoNotExist)("webpack.config.js")},{text:"Add Webpack build tasks to package.json",task:function(){var a=(0,_asyncToGenerator2.default)(function*({assetsDirectory:a,outputDirectory:b,sourceDirectory:c}){const d=_objectSpread({},DEPLOY_SCRIPTS,{clean:`del-cli ${b}`,copy:"npm-run-all --parallel copy:assets","copy:assets":`cpy \"${a}/!(css)/**/*.*\" \"${a}/**/[.]*\" ${b} --parents --recursive`,"prebuild:es":`del-cli ${(0,_path.join)(b,a)}`,"build:es":"webpack","build:stats":"webpack --mode production --profile --json > stats.json","build:analyze":"webpack-bundle-analyzer ./stats.json","postbuild:es":"npm run copy","watch:assets":`watch \"npm run copy\" ${a}`,"watch:es":`watch \"npm run build:es\" ${c}`,dashboard:"webpack-dashboard -- webpack-dev-server --config ./webpack.config.js"});yield new _api.PackageJsonEditor().extend({scripts:d}).commit()});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_api.allDoExist)("package.json")},{text:"Configure dev task",task:function(){var a=(0,_asyncToGenerator2.default)(function*({skipInstall:a}){try{yield(0,_api.install)(["stmux"],{dev:!0,skipInstall:a})}catch(a){yield(0,_api.debug)(a,"Failed to install stmux")}yield new _api.PackageJsonEditor().extend({scripts:{dev:"stmux [ \"npm run dashboard\" : \"npm run lint:ing\" ]"}}).commit()});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_api.allDoExist)("package.json",".eslintrc.js"),optional:()=>(0,_api.allDoExistSync)("package.json",".eslintrc.js")},{text:"Install Webpack and development dependencies",task:({skipInstall:a})=>(0,_api.install)([...DEV_DEPENDENCIES,...DEPENDENCIES],{dev:!0,skipInstall:a}),condition:({isNotOffline:a,skipInstall:b})=>!b&&a&&(0,_api.allDoExist)("package.json")},{text:"Install Cesium dependencies",task:({skipInstall:a,useReact:b})=>(0,_api.install)(b?RESIUM_DEPENDENCIES:CESIUM_DEPENDENCIES,{skipInstall:a}),condition:({withCesium:a})=>a,optional:({withCesium:a})=>a},{text:"Install Rust dependencies",task:({skipInstall:a})=>(0,_api.install)(WITH_RUST_DEPENDENCIES,{dev:!0,skipInstall:a}),condition:({withRust:a})=>a,optional:({withRust:a})=>a}];exports.addWebpack=addWebpack;const removeWebpack=[{text:"Delete Webpack configuration file",task:function(){var a=(0,_asyncToGenerator2.default)(function*(){yield new _api.WebpackConfigEditor().delete().commit()});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_api.allDoExist)("webpack.config.js")},{text:"Remove Webpack build tasks from package.json",task:function(){var a=(0,_asyncToGenerator2.default)(function*(){yield new _api.PackageJsonEditor().extend({scripts:{copy:void 0,"copy:assets":void 0,"copy:index":void 0,"watch:assets":void 0,dev:void 0,"prebuild:es":void 0,"build:es":void 0,"postbuild:es":void 0,"watch:es":void 0,dashboard:void 0,predeploy:void 0,deploy:void 0}}).commit()});return function task(){return a.apply(this,arguments)}}(),condition:()=>(0,_api.allDoExist)("package.json")},{text:"Uninstall Webpack dependencies",task:()=>(0,_api.uninstall)([...DEV_DEPENDENCIES,...DEPENDENCIES,"stmux"]),condition:({skipInstall:a})=>!a&&(0,_api.allDoExist)("package.json")&&new _api.PackageJsonEditor().hasAll(...DEPENDENCIES),optional:({skipInstall:a})=>!a},{text:"Uninstall Cesium Webpack dependencies",task:()=>(0,_api.uninstall)(WITH_CESIUM_DEPENDENCIES),condition:({skipInstall:a})=>!a&&(0,_api.allDoExist)("package.json")&&new _api.PackageJsonEditor().hasAll(...WITH_CESIUM_DEPENDENCIES),//eslint-disable-line max-len
optional:({skipInstall:a,withCesium:b})=>!a&&b},{text:"Uninstall Rust Webpack dependencies",task:()=>(0,_api.uninstall)(WITH_RUST_DEPENDENCIES),condition:({skipInstall:a})=>!a&&(0,_api.allDoExist)("package.json")&&new _api.PackageJsonEditor().hasAll(...WITH_RUST_DEPENDENCIES),//eslint-disable-line max-len
optional:({skipInstall:a,withRust:b})=>!a&&b}];exports.removeWebpack=removeWebpack;var _default=addWebpack;exports.default=_default;