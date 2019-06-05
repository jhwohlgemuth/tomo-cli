process.once('loaded', () => {
    window.nodeRequire = require;
    delete window.require;
    delete window.exports;
    delete window.module;
    global.__devtron = {require, process};
    if (process.env.NODE_ENV === 'test') {
        global.electronRequire = require;
    }
});
