import { Command, CommandContext } from "../interfaces/commands/commands";

export const ExitCommand: Command = {
  name: "exit",
  aliases: ["quit", "q"],
  help: "Exit the chat room",
  execute: (_args: string[], ctx: CommandContext) => {
    ctx.end();
  },
};
