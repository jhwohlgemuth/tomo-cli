/**
 * Static HTTP Server
 * @see [Using Express.js Middleware]{@link http://expressjs.com/guide/using-middleware.html}
 * @see [Third-Party Middleware]}@link http://expressjs.com/resources/middleware.html}
 * @see [krakenjs/lusca]{@link https://github.com/krakenjs/lusca}
 * @see [helmetjs/helmet]{@link https://github.com/helmetjs/helmet}
 */
const fs = require('fs-extra');
const {join} = require('path');
const https = require('https');
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
    .use(lusca.csrf()) // Cross Site Request Forgery
    .use(lusca.csp({policy: config.csp})) // Content Security Policy
    .use(lusca.hsts({maxAge: 31536000}))
    .use(lusca.xssProtection(true))
    .use(helmet.noSniff())
    .use(helmet.ieNoOpen())
    .use(helmet.referrerPolicy({policy: 'no-referrer'}))
    .use(helmet.frameguard({action: 'sameorigin'}))
    .use(helmet.featurePolicy({ // https://helmetjs.github.io/docs/feature-policy/
        camera: [`'none'`],
        fullscreen: [`'self'`],
        geolocation: [`'self'`],
        microphone: [`'none'`],
        payment: [`'self'`]
    }))
    .use(compress()) // Use gzip compression
    .get('/', verifyCsrfHeader, (req, res) => {
        res.render('index', {
            message: 'The server is functioning properly!'
        });
    })
    .get('/:page.md', verifyCsrfHeader, (req, res) => {
        const {page} = req.params;
        res.render(`${page}.md`);
    })
    .use(express.static(join(__dirname, 'public')));
exports.app = app;
//
// Static HTTP Server
//
const HTTP_PORT = config.get('http').port;
const server = app.listen(HTTP_PORT);
log.info('HTTP server started........', 'Listening on port %j', HTTP_PORT);
//
// Static HTTPS Server
//
const HTTPS_PORT = config.get('https').port;
const key = fs.readFileSync('ssl/server.key', 'utf8');
const cert = fs.readFileSync('ssl/server.cert', 'utf8');
https.createServer({key, cert}, app).listen();
log.info('HTTPS server started.......', 'Listening on port %j', HTTPS_PORT);

exports.server = server;