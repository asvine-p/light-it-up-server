import WebSocket from 'ws';
import { githubEmitter } from '../api/controllers/github';

let wss;

const initWebSocketServer = (server) => {
  wss = new WebSocket.Server({ server });

  // ON CONNECTION
  wss.on('connection', (ws) => {
    ws.isAlive = true; // eslint-disable-line no-param-reassign

    // ON PONG
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    // SEND EVENT TO ESP
    githubEmitter.on('githubEvent', (animation) => {
      const { lightAnimation: { animationId } = {}, duration } = animation;
      ws.send(`${animationId},${duration}`);
    });

    // ON MESSAGE
    ws.on('message', (message) => {
      // log the received message and send it back to the client
      console.log('received: %s', message); // eslint-disable-line no-console
    });
  });

  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        ws.terminate();
      } else {
        ws.isAlive = false;
        ws.ping(() => {
          console.log('Send Ping to client'); // eslint-disable-line no-console
        });
      }
    });
  }, 60000);

  // ON CLOSE
  wss.on('close', () => {
    clearInterval(interval);
  });
};

export default initWebSocketServer;
