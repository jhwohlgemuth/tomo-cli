require('dotenv').config();

const config = require('config');
const log = require('npmlog');
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
require('./server');
//
// WebSocket Server
//
require('./socket');
//
// GraphQL Server
//
const gql = require('./graphql');
const {port} = config.get('graphql');
gql.listen(port);
log.info('GraphQL server started.....', 'Listening on port %j', port);
