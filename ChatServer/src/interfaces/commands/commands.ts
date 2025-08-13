import { IClientSession } from "../client.interface";

export interface CommandContext {
  name: string;
  setName(next: string): void;
  send(msg: string): void;
  broadcast(msg: string, sender: IClientSession): void;
  end(): void;
}

export interface Command {
  readonly name: string;
  readonly aliases?: string[];
  execute(args: string[], ctx: CommandContext): Promise<void> | void;
  help?: string;
}
