import express, { Application, Request, Response } from 'express';
import * as http from 'http';
import { WebSocket } from 'ws';
import { Blockchain } from './blockchain/models/blockchain.model';

const app: Application = express();
const port: number | string = process.env.PORT || 8000;

const server = http.createServer(app);

// const wss = new WebSocket.Server({ server });

// wss.on('connection', (ws: WebSocket) => {
//   console.log('Connected');

//   // ws.isAlive = true;

//   // ws.on('pong', () => {
//   //   ws.isAlive = true;
//   // });

//   const broadCasting = (ws: WebSocket) => {
//     //connection is up, let's add a simple simple event
//     ws.on('message', (message: string) => {
//       //log the received message and send it back to the client
//       console.log('received: %s', message);

//       const broadcastRegex = /^broadcast\:/;

//       if (broadcastRegex.test(message)) {
//         message = message.replace(broadcastRegex, '');

//         //send back the message to the other clients
//         wss.clients.forEach((client) => {
//           if (client !== ws) {
//             client.send(`Hello, broadcast message -> ${message}`);
//           }
//         });
//       } else {
//         ws.send(`Hello, you sent -> ${message}`);
//       }
//     });
//   };

//   broadCasting(ws);

//   //   setInterval(() => {
//   //     wss.clients.forEach((ws: ExtWebSocket) => {

//   //         if (!ws.isAlive) return ws.terminate();

//   //         ws.isAlive = false;
//   //         ws.ping(null, false, true);
//   //     });
//   // }, 10000);
// });

server.listen(port, () => console.log(`Server started on port ${port} :)`));

(async () => {
  const blockchain = new Blockchain();
  await blockchain.createGenesisBlock();
  console.log('⏳ Initializing the blockchain, creating the genesis block...');

  //TODO listen when user sends amount

  blockchain.createTransaction({ sender: 'Bohdan M.', reciepent: 'Piotr G.', amount: 100 });
  blockchain.createTransaction({ sender: 'Piotr G.', reciepent: 'Robert J.', amount: 25 });
  blockchain.createTransaction({ sender: 'Robert J.', reciepent: 'Serhii M.', amount: 10 });
  await blockchain.minePendingTransactions();

  blockchain.createTransaction({ sender: 'Piotr G.', reciepent: 'Jan K.', amount: 14 });

  await blockchain.minePendingTransactions();

  blockchain.createTransaction({ sender: 'Serhii G.', reciepent: 'Piotr G.', amount: 0.1 });

  await blockchain.minePendingTransactions();
  console.log(blockchain);
})();
