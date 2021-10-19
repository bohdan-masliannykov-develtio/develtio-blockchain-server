import * as WebSocket from 'ws';
import { Message } from '@shared/models/message';
import { MessageServer } from './message-server';

type BlockChainMessage = Message;

export class BlockchainServer extends MessageServer<BlockChainMessage> {
  constructor(wsServer: WebSocket.Server) {
    super(wsServer);
  }

  protected handleMessage(sender: WebSocket, message: BlockChainMessage) {
    console.log(sender, message);
  }
}
