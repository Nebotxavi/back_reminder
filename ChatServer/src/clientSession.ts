import { IClientSession } from "./interfaces/client.interface";
import { IChatRoom } from "./interfaces/chatRoom.interface";
import { ISocket } from "./interfaces/socket.interface";
import { CommandContext } from "./interfaces/commands/commands";
import { CommandRouter } from "./commands/commandRouter";
import { NoNameProvidedError } from "./errors/errors";
import { NameAlreadyInUseError } from "./errors/errors";

export class ClientSession implements IClientSession {
  name: string | null = null;

  constructor(
    private readonly socket: ISocket,
    private readonly chatRoom: IChatRoom,
    private readonly commands: CommandRouter
  ) {
    this.send("Please introduce your nickname\n");

    socket.on("data", this.handleData.bind(this));
    socket.on("end", () => this.chatRoom.removeClient(this));
    socket.on("error", this.handleError.bind(this));
  }

  private handleData(chunk: Buffer) {
    const message = chunk.toString().trim();

    if (!this.name) {
      this.handleSetName(message);
      return;
    }

    const handled = this.commands.handle(message, this.ctx());
    if (handled) return;

    this.chatRoom.broadcast(`${this.name}: ${message}\n`, this);
  }

  private handleError(err: Error) {
    console.error(`Error from ${this.name ?? "unknown"}: ${err.message}`);
    this.close();
  }

  private handleSetName(name: string) {
    try {
      this.setName(name);
      this.send(`Hello ${this.name}! You can now start chatting.\n`);
      this.chatRoom.broadcast(`${this.name} has joined the chat.\n`, this);
    } catch (error) {
      if (error instanceof NoNameProvidedError) {
        this.send("Please provide a name\n");
      }
      if (error instanceof NameAlreadyInUseError) {
        this.send("Name already in use\n");
      }
    }
  }

  send(message: string) {
    this.socket.write(message);
  }

  private close(): void {
    this.socket.end();
  }

  private changeName(name: string) {
    this.setName(name);
  }

  private ctx(): CommandContext {
    return {
      name: this.name!,
      setName: (next) => this.changeName(next),
      send: (msg) => this.send(msg),
      broadcast: (msg) => this.chatRoom.broadcast(msg, this),
      end: () => this.close(),
    };
  }

  private setName(name: string) {
    if (!name.trim()) {
      throw new NoNameProvidedError();
    }
    if (!this.chatRoom.isNameAvailable(name)) {
      throw new NameAlreadyInUseError("Name already in use");
    }

    this.name = name;
  }
}
