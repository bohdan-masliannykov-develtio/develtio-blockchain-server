import * as WebSocket from 'ws';
export abstract class MessageServer<T> {
  protected get clients(): any {
    return this.wsServer.clients;
  }

  protected get clientIsNotAlone(): boolean {
    return this.clients.size > 1;
  }

  constructor(private readonly wsServer: WebSocket.Server) {
    this.wsServer.on('connection', this.subscribeToMessages);
    this.wsServer.on('error', this.cleanupDeadClients);
  }

  protected abstract handleMessage(sender: WebSocket, message: T): void;

  protected subscribeToMessages(ws: WebSocket): void {
    console.log('connected');
  }

  protected replyTo(client: WebSocket, message: Readonly<T>): void {
    client.send(JSON.stringify(message));
  }

  protected broadcastExcept(currentClient: WebSocket, message: Readonly<T>): void {
    this.wsServer.clients.forEach((client: any) => {
      if (this.isAlive(client) && client !== currentClient) {
        client.send(JSON.stringify(message));
      }
    });
  }

  private isAlive(client: WebSocket): boolean {
    return !this.isDead(client);
  }

  private isDead(client: WebSocket): boolean {
    return client.readyState === WebSocket.CLOSING || client.readyState === WebSocket.CLOSED;
  }

  protected cleanupDeadClients(): void {}
}
