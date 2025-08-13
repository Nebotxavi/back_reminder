import { Command, CommandContext } from "../interfaces/commands/commands";

export class CommandRouter {
  private commands = new Map<string, Command>();

  register(cmd: Command) {
    this.commands.set(cmd.name, cmd);
    cmd.aliases?.forEach((alias) => this.commands.set(alias, cmd));
  }

  handle(line: string, ctx: CommandContext): boolean {
    if (!line.startsWith("/")) return false;

    const [raw, ...rest] = line.slice(1).split(/\s+/);
    const key = raw.toLowerCase();
    const cmd = this.commands.get(key);

    if (!cmd) {
      ctx.send(`Unknown command: /${raw}. Try /help\n`);
      return true;
    }

    try {
      void cmd.execute(rest, ctx);
    } catch (e: any) {
      ctx.send(`Command error: ${e?.message ?? "unknown error"}\n`);
    }
    return true;
  }

  buildHelp(): string {
    const byName = new Map<string, Command>();
    for (const [k, v] of this.commands) byName.set(v.name, v);
    const lines = [...byName.values()]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(
        (c) =>
          `/${c.name}${
            c.aliases?.length ? ` (${c.aliases.join(", ")})` : ""
          } — ${c.help ?? ""}`
      );
    return "Available commands:\n" + lines.join("\n") + "\n";
  }
}
