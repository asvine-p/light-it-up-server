import WebSocket from 'ws';
import LED_MODES from '../constatns/ledModesConstants';
import { githubEmitter } from '../api/controllers/github';
let wss;

export const initWebSocketServer = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    githubEmitter.on('githubEvent', (light_animation) => {
      const { animation_mode_id, duration } = light_animation;

      ws.send(`${animation_mode_id},${duration}`);
    });

    ws.on('message', (message) => {
      //log the received message and send it back to the client
      console.log('received: %s', message);
    });
  });
};
