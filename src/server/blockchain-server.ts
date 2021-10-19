import { UUID } from '@shared/models/message';
import * as WebSocket from 'ws';
import { Message } from '@shared/models/message';
import { MessageServer } from '@server/message-server';
import { MessageTypes } from '@shared/enums/message-types.enum';

type Replies = Map<WebSocket, Message>;
export class BlockchainServer extends MessageServer<Message> {
  private readonly recievedMessagesAwaitingResponse = new Map<UUID, WebSocket>();
  private readonly sentMessagesAwaitingReply = new Map<UUID, Replies>();

  constructor(wsServer: WebSocket.Server) {
    super(wsServer);
    console.log(this.recievedMessagesAwaitingResponse);
  }

  protected handleMessage(sender: WebSocket, message: Message) {
    console.log(sender, message);
    switch (message.type) {
      case MessageTypes.GET_LONGEST_CHAIN_REQUEST:
        return this.handleLongestChainRequest(sender, message);
      case MessageTypes.GET_LONGEST_CHAIN_RESPONSE:
        return this.handleLongestChainResponse(sender, message);
      case MessageTypes.NEW_BLOCK_REQUEST:
        return this.handleAddTransactionRequest(sender, message);
      case MessageTypes.NEW_BLOCK_ANNOUNCEMENT:
        return this.handleNewBlockAnnouncement(sender, message);
      default:
        console.log(`Received message of unknown type: "${message.type}"`);
        break;
    }
  }

  private handleLongestChainRequest(requestor: WebSocket, message: Message): void {
    //1. Detect if only one Node is active in network
    if (this.clientIsNotAlone) {
      //2. Store client request
      this.recievedMessagesAwaitingResponse.set(message.correlationId, requestor);

      //3. Accumulate replies from clients
      this.sentMessagesAwaitingReply.set(message.correlationId, new Map());
    } else {
      //4. There is no longest chain in single-node blockchain

      this.replyTo(requestor, {
        type: MessageTypes.GET_LONGEST_CHAIN_RESPONSE,
        correlationId: message.correlationId,
        payload: [],
      });
    }
  }

  private handleLongestChainResponse(sender: WebSocket, message: Message): void {
    //1. Find the client that requested the longest chain
    if (this.recievedMessagesAwaitingResponse.has(message.correlationId)) {
      //2. Get the reference to the clients socket object
      const requestor = this.recievedMessagesAwaitingResponse.get(message.correlationId);

      //3. Check if everyoneReplied
      if (this.everyoneReplied(sender, message)) {
        //4. Get all replies
        const allReplies = this.sentMessagesAwaitingReply.get(message.correlationId).values();
        //5. Find the longestChain from replies
        const longestChain = Array.from(allReplies).reduce(this.selectTheLongestChain);
        //6. Reply to the node waiting for longestChain
        this.replyTo(sender, longestChain);
      }
    }
  }

  private handleAddTransactionRequest(requestor: WebSocket, message: Message): void {
    //1. Get transactions from the node and share them to another nodes
    this.broadcastExcept(requestor, message);
  }

  private handleNewBlockAnnouncement(requestor: WebSocket, message: Message): void {
    //1. Announce finished minining block
    this.broadcastExcept(requestor, message);
  }

  private selectTheLongestChain(currentlyLongest: Message, current: Message, index: number) {
    return index > 0 && current.payload.length > currentlyLongest.payload.length ? current : currentlyLongest;
  }

  private everyoneReplied(sender: WebSocket, message: Message): boolean {
    const repliedClients = this.sentMessagesAwaitingReply.get(message.correlationId).set(sender, message);

    const awaitingForClients = Array.from(this.clients).filter((c: any) => !repliedClients.has(c));
    return awaitingForClients.length === 1;
  }
}
