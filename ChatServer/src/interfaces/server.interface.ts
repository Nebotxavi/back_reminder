import { IChatRoom } from "./chatRoom.interface";
import { IClientFactory } from "./client.interface";

export interface IServer {
  listen(port: number, callback?: () => void): void;
  close(): void;
}

export interface IServerFactory {
  createServer(clientFactory: IClientFactory, chatRoom: IChatRoom): IServer;
}
