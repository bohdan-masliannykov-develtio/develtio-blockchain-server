import express, { Application, Request, Response } from 'express';
import * as http from 'http';
import { WebSocket } from 'ws';
import { Blockchain } from './blockchain/models/blockchain.model';

const app: Application = express();
const port: number | string = process.env.PORT || 8000;

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
  console.log('Connected');

  // ws.isAlive = true;

  // ws.on('pong', () => {
  //   ws.isAlive = true;
  // });

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

  //   setInterval(() => {
  //     wss.clients.forEach((ws: ExtWebSocket) => {

  //         if (!ws.isAlive) return ws.terminate();

  //         ws.isAlive = false;
  //         ws.ping(null, false, true);
  //     });
  // }, 10000);
});

server.listen(port, () => console.log(`Server started on port ${port} :)`));

console.log('Creating the blockchain with the genesis block...');
const blockchain = new Blockchain();

// for (let i = 0; i <= 100; i++) {
//   console.log(`Mining block #${i}...`);
//   blockchain.addBlock(`#${i} block`);
// }

console.log(JSON.stringify(blockchain, null, 2));
