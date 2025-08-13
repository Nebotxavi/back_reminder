import { ClientSession } from "../src/clientSession";
import { CommandRouter } from "../src/commands/commandRouter";
import { ExitCommand } from "../src/commands/exit";
import { IChatRoom } from "../src/interfaces/chatRoom.interface";
import { ISocket } from "../src/interfaces/socket.interface";

type DataListener = (chunk: Buffer) => void;
type EndListener = () => void;
type ErrorListener = (err: Error) => void;

class MockSocket implements ISocket {
  public writtenMessages: string[] = [];
  public isClosed: boolean = false;

  private dataListeners: DataListener[] = [];
  private endListeners: EndListener[] = [];
  private errorListeners: ErrorListener[] = [];

  write(message: string): void {
    this.writtenMessages.push(message);
  }

  end(): void {
    this.isClosed = true;
    this.endListeners.forEach((listener) => listener());
  }

  on(event: "data" | "end" | "error", listener: any): this {
    if (event === "data") {
      this.dataListeners.push(listener);
    } else if (event === "end") {
      this.endListeners.push(listener);
    } else if (event === "error") {
      this.errorListeners.push(listener);
    }

    return this;
  }

  // === Helpers to simulate events ===

  triggerData(message: string): void {
    const buffer = Buffer.from(message);
    this.dataListeners.forEach((listener) => listener(buffer));
  }

  triggerError(error: Error): void {
    this.errorListeners.forEach((listener) => listener(error));
  }

  triggerEnd(): void {
    this.endListeners.forEach((listener) => listener());
  }
}

const mockChatRoom: IChatRoom = {
  addClient: vi.fn(),
  removeClient: vi.fn(),
  broadcast: vi.fn(),
  isNameAvailable: vi.fn().mockReturnValue(true),
};

const router = new CommandRouter();
router.register(ExitCommand);

const mockRouterRegister = vi
  .spyOn(router, "register")
  .mockImplementation(() => {});
const mockRouterHandle = vi.spyOn(router, "handle").mockReturnValue(false);
const mockRouterBuildHelp = vi
  .spyOn(router, "buildHelp")
  .mockReturnValue("Available commands:\n");

const FAKE_NAME = "FakeName";
const FAKE_MESSAGE = "Hello world";

describe("ClientSession", () => {
  it("should create an instance with a socket and chat room", () => {
    const socket = new MockSocket();
    const chatRoom = mockChatRoom;

    const client = new ClientSession(socket, chatRoom, router);
    expect(client).toBeInstanceOf(ClientSession);
  });

  it("should set name and broadcast join message on first input", () => {
    const socket = new MockSocket();
    const chatRoom = mockChatRoom;

    const client = new ClientSession(socket, chatRoom, router);

    socket.triggerData("FakeName");

    expect(client.name).toBe("FakeName");
    expect(socket.writtenMessages[0]).toBe("Please introduce your nickname\n");
    expect(socket.writtenMessages[1]).toMatch(/Hello FakeName.*/);
    expect(chatRoom.broadcast).toHaveBeenCalledWith(
      "FakeName has joined the chat.\n",
      client
    );
  });

  it("should broadcast message after the name has been introduced", () => {
    const socket = new MockSocket();
    const chatRoom = mockChatRoom;

    const client = new ClientSession(socket, chatRoom, router);

    socket.triggerData(FAKE_NAME);
    expect(chatRoom.broadcast).toHaveBeenCalledWith(
      `${FAKE_NAME} has joined the chat.\n`,
      client
    );
    socket.triggerData(FAKE_MESSAGE);

    expect(chatRoom.broadcast).toHaveBeenCalledWith(
      `${FAKE_NAME}: ${FAKE_MESSAGE}\n`,
      client
    );
  });

  it("should call commands handle method on inserting command /exit", () => {
    const socket = new MockSocket();
    const chatRoom = mockChatRoom;

    const client = new ClientSession(socket, chatRoom, router);

    socket.triggerData(FAKE_NAME);
    socket.triggerData("/exit");

    expect(mockRouterHandle).toHaveBeenCalled();
  });

  it("should call removeClient on socket end", () => {
    const socket = new MockSocket();
    const chatRoom = mockChatRoom;

    const client = new ClientSession(socket, chatRoom, router);

    socket.triggerData(FAKE_NAME);
    socket.triggerEnd();

    expect(chatRoom.removeClient).toHaveBeenCalledWith(client);
  });

  it("should handle socket error and close", () => {
    const socket = new MockSocket();
    const chatRoom = mockChatRoom;

    const client = new ClientSession(socket, chatRoom, router);

    socket.triggerError(new Error("Connection lost"));

    expect(socket.isClosed).toBe(true);
    expect(chatRoom.removeClient).toHaveBeenCalledWith(client);
  });
});
