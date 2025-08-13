import { ISocket } from "./socket.interface";
import { IChatRoom } from "./chatRoom.interface";

export interface IClientSession {
  name: string | null;
  send(message: string): void;
}

export interface IClientFactory {
  createClient(socket: ISocket, chatRoom: IChatRoom): IClientSession;
}
