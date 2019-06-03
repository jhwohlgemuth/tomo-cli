const uuid = require('node-uuid');

module.exports = {
    execMap: {
        py: 'python',
        rb: 'ruby'
    },
    session: {
        name: 'customSessionId',
        secret: 'Quidquid latine dictum, altum videtur',
        genid: function() {
            return uuid.v1();
        },
        resave: false,
        saveUninitialized: false,
        cookie: {httpOnly: true, secure: true}
    },
    websocket: {
        port: 13337
    },
    http: {
        port: process.env.PORT || 8111// eslint-disable-line no-magic-numbers
    },
    https: {
        port: 8443
    },
    graphql: {
        port: 4669
    },
    log: {
        level: 'error'
    },
    csp: {
        'frame-ancestors': `'self'`,
        'default-src': `'self'`,
        'script-src':  `'self' cdnjs.cloudflare.com`,
        'font-src': `'self' fonts.gstatic.com data:`
    }
};
