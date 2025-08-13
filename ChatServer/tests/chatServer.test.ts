import { Mocked } from "vitest";
import { ChatServer } from "../src/chatServer";
import { ClientFactory } from "../src/clientFactory";
import { CommandRouter } from "../src/commands/commandRouter";
import { IChatRoom } from "../src/interfaces/chatRoom.interface";
import { Command } from "../src/interfaces/commands/commands";
import { IServerFactory } from "../src/interfaces/server.interface";

const listenMock = vi.fn();
const closeMock = vi.fn();

const router = new CommandRouter();

vi.spyOn(router, "register").mockImplementation(() => {});
vi.spyOn(router, "handle").mockReturnValue(true);
vi.spyOn(router, "buildHelp").mockReturnValue("Available commands:\n");

const mockChatRoom: IChatRoom = {
  addClient: vi.fn(),
  removeClient: vi.fn(),
  broadcast: vi.fn(),
  isNameAvailable: vi.fn(),
};

const mockServerFactory: IServerFactory = {
  createServer: vi.fn().mockReturnValue({
    listen: listenMock,
    close: closeMock,
  }),
};

describe("ChatServer", () => {
  it("should create an instance with a server factory, chat room, and client factory", () => {
    const chatRoom = mockChatRoom;
    const clientFactory = new ClientFactory(router);
    const serverFactory = mockServerFactory;

    const chatServer = new ChatServer(
      3000,
      chatRoom,
      clientFactory,
      serverFactory
    );

    expect(chatServer).toBeInstanceOf(ChatServer);
    expect(mockServerFactory.createServer).toHaveBeenCalledWith(
      clientFactory,
      chatRoom
    );
  });

  it("should call server listen on start", () => {
    const chatRoom = mockChatRoom;
    const clientFactory = new ClientFactory(router);
    const serverFactory = mockServerFactory;

    const chatServer = new ChatServer(
      3000,
      chatRoom,
      clientFactory,
      serverFactory
    );

    chatServer.start();
    expect(listenMock).toHaveBeenCalledWith(3000, expect.any(Function));
  });

  it("should call server close on stop", () => {
    const chatRoom = mockChatRoom;
    const clientFactory = new ClientFactory(router);
    const serverFactory = mockServerFactory;

    const chatServer = new ChatServer(
      3000,
      chatRoom,
      clientFactory,
      serverFactory
    );

    chatServer.stop();
    expect(closeMock).toHaveBeenCalledWith();
  });
});
