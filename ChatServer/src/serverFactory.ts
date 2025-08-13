import { IServerFactory } from "./interfaces/server.interface";
import net, { Socket } from "net";
import { IChatRoom } from "./interfaces/chatRoom.interface";
import { IClientFactory } from "./interfaces/client.interface";
import { IServer } from "./interfaces/server.interface";

export class ServerFactory implements IServerFactory {
  createServer(clientFactory: IClientFactory, chatRoom: IChatRoom): IServer {
    return net.createServer((socket: Socket) => {
      const client = clientFactory.createClient(socket, chatRoom);
      chatRoom.addClient(client);
    });
  }
}
