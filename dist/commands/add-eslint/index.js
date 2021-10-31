"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.tasks=void 0;var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_path=require("path"),_lodash=_interopRequireDefault(require("lodash.merge")),_api=require("../../api");const ESLINT_DEPENDENCIES=["eslint@^7","babel-eslint","eslint-config-omaha-prime-grade","eslint-plugin-import",// 'eslint-plugin-promise'
"watch"],ESLINT_REACT_PLUGINS=["eslint-plugin-react"],ESLINT_SETTINGS={extends:[`'omaha-prime-grade'`,`'plugin:import/errors'`,`'plugin:import/warnings'`,`'plugin:promise/recommended'`]},REACT_ESLINT_SETTINGS=(0,_lodash.default)({},ESLINT_SETTINGS,{parserOptions:{ecmaFeatures:{jsx:!0}},plugins:[`'jsx-a11y'`],extends:[,,,,`'plugin:react/recommended'`,`'plugin:jsx-a11y/recommended'`]}),tasks=[{text:"Create ESLint configuration and .eslintignore files",task:function(){var _ref=(0,_asyncToGenerator2.default)(function*({overwrite}){yield new _api.EslintConfigModuleEditor().create().commit(),((0,_api.allDoNotExistSync)(".eslintignore")||overwrite)&&(yield new _api.Scaffolder((0,_path.join)(__dirname,"templates")).copy(".eslintignore").commit())});return function task(){return _ref.apply(this,arguments)}}(),condition:({overwrite})=>overwrite||(0,_api.allDoNotExist)(".eslintrc.js",".eslintrc",".eslintrc.json",".eslintrc.yml")},{text:"Add lint tasks to package.json",task:function(){var _ref2=(0,_asyncToGenerator2.default)(function*({sourceDirectory}){yield new _api.PackageJsonEditor().extend({scripts:{lint:`eslint . -c ./.eslintrc.js --ext .js,.jsx --fix`,"lint:ing":`watch "npm run lint" ${sourceDirectory}`,"lint:tests":"eslint __tests__/**/*.js -c ./.eslintrc.js --fix --no-ignore"}}).commit()});return function task(){return _ref2.apply(this,arguments)}}(),condition:()=>(0,_api.allDoExist)("package.json")},{text:"Install ESLint dependencies",task:({skipInstall})=>(0,_api.install)(ESLINT_DEPENDENCIES,{dev:!0,skipInstall}),condition:({skipInstall})=>!skipInstall&&(0,_api.allDoExist)("package.json")},{text:"Install ESLint React plugins",task:({skipInstall})=>(0,_api.install)(ESLINT_REACT_PLUGINS,{dev:!0,skipInstall}),condition:({skipInstall,useReact})=>!skipInstall&&useReact&&(0,_api.allDoExist)("package.json"),optional:({useReact})=>useReact},{text:"Add lit-html support to ESLint configuration file",task:function(){var _ref3=(0,_asyncToGenerator2.default)(function*({browser,skipInstall}){yield(0,_api.install)(["eslint-plugin-lit"],{dev:!0,skipInstall}),yield new _api.EslintConfigModuleEditor().extend((0,_lodash.default)({},ESLINT_SETTINGS,{env:{browser},plugins:[`'lit'`]})).extend({extends:[,,,`'plugin:lit/recommended'`]}).commit()});return function task(){return _ref3.apply(this,arguments)}}(),condition:({browser,useReact})=>browser&&!useReact&&(0,_api.allDoExist)("package.json",".eslintrc.js"),optional:({browser,useReact})=>browser&&!useReact},{text:"Add React support to ESLint configuration file",task:function(){var _ref4=(0,_asyncToGenerator2.default)(function*({browser,skipInstall}){yield(0,_api.install)(["eslint-plugin-jsx-a11y"],{dev:!0,skipInstall}),yield new _api.EslintConfigModuleEditor().extend((0,_lodash.default)({},REACT_ESLINT_SETTINGS,{env:{browser},settings:{react:{version:`'detect'`}}})).commit()});return function task(){return _ref4.apply(this,arguments)}}(),condition:({useReact})=>useReact&&(0,_api.allDoExist)(".eslintrc.js"),optional:({useReact})=>useReact}];exports.tasks=tasks;var _default=tasks;exports.default=_default;