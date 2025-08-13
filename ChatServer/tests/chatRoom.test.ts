import { ChatRoom } from "../src/chatRoom";
import { IClientSession } from "../src/interfaces/client.interface";

class MockClient implements IClientSession {
  name: string | null;
  messages: string[] = [];

  constructor(name: string | null = null) {
    this.name = name;
  }

  send(message: string): void {
    this.messages.push(message);
  }

  close(): void {}
}

describe("ChatRoom", () => {
  it("should broadcast message to added clients", () => {
    const chatRoom = new ChatRoom();
    const client1 = new MockClient("Client 1");
    const client2 = new MockClient("Client 2");

    chatRoom.addClient(client1);
    chatRoom.addClient(client2);

    chatRoom.broadcast("Hello world", client1);
    expect(client2.messages).toEqual(["Hello world"]);
  });

  it("should remove a client to the room", () => {
    const chatRoom = new ChatRoom();
    const client1 = new MockClient("Client 1");
    const client2 = new MockClient("Client 2");

    chatRoom.addClient(client1);
    chatRoom.addClient(client2);

    chatRoom.removeClient(client2);

    chatRoom.broadcast("Hello again", client1);

    expect(client2.messages).not.toContain("Hello again");
  });

  it("should broadcast that a client left the room", () => {
    const chatRoom = new ChatRoom();
    const client1 = new MockClient("Client 1");
    const client2 = new MockClient("Client 2");

    chatRoom.addClient(client1);
    chatRoom.addClient(client2);

    chatRoom.removeClient(client2);
    expect(client1.messages[0]).toMatch(/Client 2.*left the chat/);
  });

  it("should not broadcast a message to the sender", () => {
    const chatRoom = new ChatRoom();
    const client1 = new MockClient("Client 1");

    chatRoom.addClient(client1);

    chatRoom.broadcast("Hello world", client1);
    expect(client1.messages).not.toContain("Hello world");
  });

  it("should not broadcast a message to a client without a name", () => {
    const chatRoom = new ChatRoom();
    const client1 = new MockClient(null);

    chatRoom.addClient(client1);

    chatRoom.broadcast("Hello world", client1);
    expect(client1.messages).not.toContain("Hello world");
  });
});
