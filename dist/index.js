#!/usr/bin/env node
"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault"),_extends2=_interopRequireDefault(require("@babel/runtime/helpers/extends")),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_react=_interopRequireDefault(require("react")),_ink=require("ink"),_meow=_interopRequireDefault(require("meow")),_getStdin=_interopRequireDefault(require("get-stdin")),_updateNotifier=_interopRequireDefault(require("update-notifier")),_api=require("./api"),_cli=require("./cli"),_commands=_interopRequireDefault(require("./commands"));// Notify updater
const pkg=require(`../package.json`);(0,_updateNotifier.default)({pkg}).notify();const{input,flags}=(0,_meow.default)(_cli.options);("version"===input[0]||flags.version)&&(0,_api.showVersion)(),(0,_asyncToGenerator2.default)(function*(){const a=yield(0,_getStdin.default)(),b={commands:_commands.default,descriptions:_cli.descriptions,flags,input,stdin:a};(0,_ink.render)(_react.default.createElement(_api.Main,(0,_extends2.default)({namespace:"tomo"},b)),{exitOnCtrlC:!0})})();