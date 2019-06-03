
require('dotenv').config();

const config = require('config');
const log = require('npmlog');
const fs = require('fs-extra');
const https = require('https');
//
// SSL credentials
//
const key = fs.readFileSync('ssl/server.key', 'utf8');
const cert = fs.readFileSync('ssl/server.cert', 'utf8');
//
// Handle error conditions
//
process.on('SIGTERM', () => {
    log.warn('exit', 'Exited on SIGTERM');
    process.exit(0);
});
process.on('SIGINT', () => {
    log.warn('exit', 'Exited on SIGINT');
    process.exit(0);
});
process.on('uncaughtException', err => {
    log.error('uncaughtException ', err);
    process.exit(1);
});
//
// Static HTTP Server
//
const app = require('./server');
app.listen(config.get('http').port);
//
// Static HTTPS Server
//
https.createServer({key, cert}, app).listen(config.get('https').port);
//
// WebSocket Server
//
const wss = require('./socket.js');
wss.on('error', data => log.error(data));
//
// GraphQL Server
//
const gql = require('./graphql.js');
gql.listen(config.get('graphql').port);
//
// Log startup and port numbers
//
log.info('HTTP server started........', 'Listening on port %j', config.get('http').port);
log.info('HTTPS server started.......', 'Listening on port %j', config.get('https').port);
log.info('WebSocket server started...', 'Listening on port %j', config.get('websocket').port);
log.info('GraphQL server started.....', 'Listening on port %j', config.get('graphql').port);
