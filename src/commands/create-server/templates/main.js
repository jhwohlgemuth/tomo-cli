/* eslint-env browser */
/* eslint-disable no-console */
/**
 * Example WebSocket code
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebSocket}
 */
const host = location.origin.replace(/^http/, 'ws');
const socket = new WebSocket(host);
socket.addEventListener('open', () => {
    socket.send('hello world');
});
socket.addEventListener('message', ({data}) => {
    console.log('I got a WebSocket message!');
    console.log(data);
});