import * as WebSocket from 'ws';
export abstract class MessageServer<T> {
  constructor(private readonly wsServer: WebSocket.Server) {
    this.wsServer.on('connection', this.subscribeToMessages);
    this.wsServer.on('error', this.cleanupDeadClients);
  }

  protected abstract handleMessage(sender: WebSocket, message: T): void;

  protected subscribeToMessages(ws: WebSocket): void {
    console.log('connected');
  }

  protected cleanupDeadClients(): void {}
}
