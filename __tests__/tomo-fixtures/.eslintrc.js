const {join} = require('path');
const {existsSync} = require('fs-extra');

module.exports = {
    env: {es6: true, jest: true},
    extends: ['omaha-prime-grade'],
    parser: 'babel-eslint'
};