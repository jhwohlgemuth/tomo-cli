
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.default = void 0;

const _utils = require('../utils');

const pkg = new _utils.PackageJsonEditor();
const _default = [{
    text: 'Add documentation tasks to package.json',
    task: ({
        sourceDirectory
    }) => pkg.extend({
        script: {
            'lint:docs': `documentation lint ${sourceDirectory}/**`,
            'build:docs': `documentation build ${sourceDirectory}/** -f html -o docs`,
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
    }) => (0, _utils.install)(['documentation', 'opn-cli'], {
        dev: true,
        skipInstall
    }),
    condition: () => (0, _utils.someDoExist)('package.json')
}];
exports.default = _default;