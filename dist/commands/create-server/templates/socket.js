/**
 * WebSocket Server
 * @see {@link https://github.com/websockets/ws}
 */
const log = require('npmlog');
const Websocket = require('ws');
const {server} = require(`${__dirname}/server`);

const wss = new Websocket.Server({server});

wss.broadcast = data => {
    wss.clients.forEach(client => {
        client.send(data);
    });
};
wss.on('connection', socket => {
    log.info(`${wss.clients.size} client(s) connected.`);
    socket.on('message', message => {
        log.info('received: %s', message);
        socket.send(message);
    });
});
wss.on('error', data => log.error(data));

module.exports = wss;
