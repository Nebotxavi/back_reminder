import { NameAlreadyInUseError, NoNameProvidedError } from "../errors/errors";
import { Command, CommandContext } from "../interfaces/commands/commands";

export const ChangeNameCommand: Command = {
  name: "changeName",
  aliases: ["nick", "n"],
  help: "Change your nickname. Usage: /changeName <new nickname>",
  execute: (args: string[], ctx: CommandContext) => {
    if (!args.length) {
      ctx.send("Please provide a new nickname\n");
      return;
    }
    const previousName = ctx.name;
    const name = args.join(" ").trim();
    try {
      ctx.setName(name);
      ctx.send(`Your new nickname is ${name}\n`);
      ctx.broadcast(`${previousName} changed his name to ${name}\n`, ctx);
    } catch (error) {
      if (error instanceof NoNameProvidedError) {
        ctx.send("Please provide a name\n");
      }
      if (error instanceof NameAlreadyInUseError) {
        ctx.send("Name already in use\n");
      }
    }
  },
};
