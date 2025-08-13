import { ChatServer } from "./chatServer";
import { ClientFactory } from "./clientFactory";
import { ChatRoom } from "./chatRoom";
import { ServerFactory } from "./serverFactory";
import { CommandRouter } from "./commands/commandRouter";
import { ExitCommand } from "./commands/exit";
import { ChangeNameCommand } from "./commands/changeName";

const router = new CommandRouter();
router.register(ExitCommand);
router.register(ChangeNameCommand);

router.register({
  name: "help",
  aliases: ["list", "h", "?"],
  help: "Show available commands.",
  execute: (_args, ctx) => ctx.send(router.buildHelp()),
});

const chatRoom = new ChatRoom();
const clientFactory = new ClientFactory(router);
const serverFactory = new ServerFactory();

const chatServer = new ChatServer(3000, chatRoom, clientFactory, serverFactory);

chatServer.start();
