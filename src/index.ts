import express, { Application, Request, Response } from 'express';
import * as http from 'http';
import { WebSocket } from 'ws';

const app: Application = express();
const port: number | string = process.env.PORT || 8000;

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
  console.log('Connected');

  const broadCasting = (ws: WebSocket) => {
    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {
      //log the received message and send it back to the client
      console.log('received: %s', message);

      const broadcastRegex = /^broadcast\:/;

      if (broadcastRegex.test(message)) {
        message = message.replace(broadcastRegex, '');

        //send back the message to the other clients
        wss.clients.forEach((client) => {
          if (client !== ws) {
            client.send(`Hello, broadcast message -> ${message}`);
          }
        });
      } else {
        ws.send(`Hello, you sent -> ${message}`);
      }
    });
  };

  broadCasting(ws);
});

server.listen(port, () => console.log(`Server started on port ${port} :)`));
