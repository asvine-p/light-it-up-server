import http from 'http';
import app from './api/app';
import { initWebSocketServer } from "./websocket";

const port = process.env.PORT || 3000;

const server = http.createServer(app);

initWebSocketServer(server);

server.listen(port);
