export type UUID = string;

export class Message {
  correlationId: UUID;
  type: string;
  payload?: any;
}
