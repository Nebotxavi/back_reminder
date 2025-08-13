import { IClientSession } from "./interfaces/client.interface";
import { IChatRoom } from "./interfaces/chatRoom.interface";

export class ChatRoom implements IChatRoom {
  private clients: Set<IClientSession> = new Set();

  addClient(client: IClientSession) {
    this.clients.add(client);
  }

  removeClient(client: IClientSession) {
    this.clients.delete(client);
    if (client.name) {
      this.broadcast(`${client.name} has left the chat.\n`, client);
    }
  }

  broadcast(message: string, sender: IClientSession) {
    for (const client of this.clients) {
      if (client !== sender && client.name) {
        client.send(message);
      }
    }
  }

  isNameAvailable(name: string): boolean {
    for (const client of this.clients) {
      if (client.name === name) {
        return false;
      }
    }
    return true;
  }
}
