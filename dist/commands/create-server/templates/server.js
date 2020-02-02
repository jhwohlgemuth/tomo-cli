/**
 * Static HTTP Server
 * @see [Using Express.js Middleware]{@link http://expressjs.com/guide/using-middleware.html}
 * @see [Third-Party Middleware]}@link http://expressjs.com/resources/middleware.html}
 * @see [krakenjs/lusca]{@link https://github.com/krakenjs/lusca}
 * @see [helmetjs/helmet]{@link https://github.com/helmetjs/helmet}
 */
const fs = require('fs-extra');
const config = require('config');
const log = require('npmlog');
const express = require('express');
const session = require('express-session');
const lusca = require('lusca');
const helmet = require('helmet');
const compress = require('compression');
const hljs = require('highlight.js');
const {Remarkable} = require('remarkable');

const md = new Remarkable({
    highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch {
                log.error('Failed to highlight language');
            }
        }
        try {
            return hljs.highlightAuto(str).value;
        } catch {
            log.error('Failed to auto highlight language');
        }
        return '';
    }
});
const setCsrfHeader = (req, res, next) => {
    res.set('X-CSRF', req.sessionID);
    return next();
};
const verifyCsrfHeader = (req, res, next) => {
    if (res.get('X-CSRF') !== req.sessionID) {
        res.status(412).end();// eslint-disable-line no-magic-numbers
    } else {
        return next();
    }
};
const app = express()
    .engine('html', require('ejs').renderFile)
    .engine('md', (path, options, fn) => {
        fs.readFile(path, 'utf8', (err, str) => {
            if (err) {return fn(err);}
            try {
                const html = md.render(str);
                fn(null, html);
            } catch (err) {
                fn(err);
            }
        });
    })
    .set('view engine', 'html')
    .set('views', `${__dirname}/public`)
    .use(session(config.get('session')))
    .use(setCsrfHeader)
    .disable('x-powered-by') // Do not advertise Express
    // .use(lusca.csrf()) // Cross Site Request Forgery
    // .use(lusca.csp({policy: config.csp})) // Content Security Policy
    .use(lusca.hsts({maxAge: 31536000}))
    .use(lusca.xssProtection(true))
    .use(helmet.noSniff())
    .use(helmet.ieNoOpen())
    .use(helmet.referrerPolicy({policy: 'no-referrer'}))
    .use(compress()) // Use gzip compression
    .use(express.static(__dirname)); // Serve static files
app.get('/', verifyCsrfHeader, (req, res) => {
    res.render('index', {
        message: 'The server is functioning properly!'
    });
});
app.get('/:page.md', verifyCsrfHeader, (req, res) => {
    const {page} = req.params;
    res.render(`${page}.md`);
});

module.exports = app;
