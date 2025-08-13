import { IClientSession } from "./client.interface";

export interface IChatRoom {
  addClient(session: IClientSession): void;
  removeClient(client: IClientSession): void;
  broadcast(message: string, sender: IClientSession): void;
  isNameAvailable(name: string): boolean;
}
