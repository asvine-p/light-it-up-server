const WebSocket = require('ws');
const ledModes = require('./ledModesConstants');

const ws = new WebSocket('ws://192.168.1.41:81');

ws.on('open', () => {
  ws.send(`${ledModes.FX_MODE_COLOR_WIPE_RANDOM},15000`);
});

ws.on('message', (data) => {
  console.log(data);
});
