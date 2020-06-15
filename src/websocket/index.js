import WebSocket from 'ws';
import LED_MODES from '../constatns/ledModesConstants';

const wss = new WebSocket.Server({ port: 8080, host: '192.168.1.100'});

wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  ws.send(`${LED_MODES.FX_MODE_RAINBOW_CYCLE},30000`);
});
