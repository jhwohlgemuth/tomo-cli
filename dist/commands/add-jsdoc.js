"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../utils");

const pkg = new _utils.PackageJsonEditor();
var _default = [{
  text: 'Add documentation tasks to package.json',
  task: ({
    sourceDirectory
  }) => pkg.extend({
    script: {
      'lint:docs': `eslint ${sourceDirectory}/*.js ${sourceDirectory}/**/*.js --no-eslintrc --rule valid-jsdoc:error --parser babel-eslint`,
      'build:docs': `jsdoc ${sourceDirectory} -r --destination ./docs`,
      'open:docs': 'opn ./docs/index.html',
      predocs: 'npm run lint:docs',
      docs: 'npm run build:docs',
      postdocs: 'npm run open:docs'
    }
  }),
  condition: () => (0, _utils.someDoExist)('package.json')
}, {
  text: 'Install Documentation.js dependencies',
  task: ({
    skipInstall
  }) => (0, _utils.install)(['jsdoc', 'opn-cli'], {
    dev: true,
    skipInstall
  }),
  condition: () => (0, _utils.someDoExist)('package.json')
}];
exports.default = _default;