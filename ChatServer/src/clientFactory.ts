import { ClientSession } from "./clientSession";
import { CommandRouter } from "./commands/commandRouter";
import { IChatRoom } from "./interfaces/chatRoom.interface";
import { IClientFactory, IClientSession } from "./interfaces/client.interface";
import { ISocket } from "./interfaces/socket.interface";

export class ClientFactory implements IClientFactory {
  constructor(private readonly commands: CommandRouter) {}

  createClient(socket: ISocket, chatRoom: IChatRoom): IClientSession {
    return new ClientSession(socket, chatRoom, this.commands);
  }
}
