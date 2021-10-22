import * as WebSocket from 'ws';
export abstract class MessageServer<T> {
  protected get clients(): any {
    return this.wsServer.clients;
  }

  protected get clientIsNotAlone(): boolean {
    return this.clients.size > 1;
  }

  constructor(private readonly wsServer: WebSocket.Server) {}

  createConnection() {
    this.wsServer.on('connection', this.subscribeToMessages.bind(this));
    this.wsServer.on('error', this.cleanupDeadClients.bind(this));
  }

  protected abstract handleMessage(sender: WebSocket, message: T): void;

  protected subscribeToMessages(ws: WebSocket): void {
    ws.on('message', (data: any) => {
      const buffText = Buffer.from(data).toString();
      if (typeof buffText === 'string') {
        this.handleMessage(ws, JSON.parse(buffText));
      } else {
        console.log('Recieved data of unsupported type');
      }
    });
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

  protected cleanupDeadClients(): void {
    this.wsServer.clients.forEach((client: any) => {
      if (this.isDead(client)) {
        this.wsServer.clients.delete(client);
      }
    });
  }
}
