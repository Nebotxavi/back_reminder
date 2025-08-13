import { IChatRoom } from "./interfaces/chatRoom.interface";
import { IClientFactory } from "./interfaces/client.interface";
import { IServerFactory } from "./interfaces/server.interface";
import { IServer } from "./interfaces/server.interface";

export class ChatServer {
  private server: IServer;

  constructor(
    private readonly port: number = 3000,
    private readonly chatRoom: IChatRoom,
    private readonly clientFactory: IClientFactory,
    private readonly serverFactory: IServerFactory
  ) {
    this.server = this.serverFactory.createServer(
      this.clientFactory,
      this.chatRoom
    );
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }

  stop() {
    this.server.close();
  }
}
