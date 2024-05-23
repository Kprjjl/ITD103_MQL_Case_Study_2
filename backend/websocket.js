const WebSocket = require('ws');

let wss;

const initializeWebSocketServer = (server) => {
    wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('Client connected');

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    return wss;
};

const broadcast = (data) => {
    if (wss) {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
};

module.exports = { initializeWebSocketServer, broadcast };
