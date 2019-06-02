/**
 * WebSocket Server
 * @see {@link https://github.com/websockets/ws}
 */
const config = require('config');
const log = require('npmlog');
const {Server} = require('ws');

const wss = new Server({
    app: require(`${__dirname}/server`),
    port: config.get('websocket').port
});

wss.broadcast = data => {
    wss.clients.forEach(client => {
        client.send(data);
    });
};
wss.on('connection', socket => {
    log.info(`${wss.clients.length} client(s) connected.`);
    socket.on('message', message => {
        log.info('received: %s', message);
        socket.send(message);
    });
});

module.exports = wss;
