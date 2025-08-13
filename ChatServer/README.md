![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)

# Chat Server

A simple TCP-based chat server built with Node.js and TypeScript, focusing on Object-Oriented Programming (OOP) principles. This project was created to practice with `net` clients, class-based architecture and for getting IRC vibes :)

## Goal

- Practice building a chat application using Node's native `net` module.
- Practice managing multiple client connections and broadcasting messages.
- Avoid forgetting **OOP concepts** (encapsulation, inheritance, polymorphism) in a real-world networking project.

## Features

- Multiple clients can connect and exchange messages in real time.
- Unique IDs or nicknames for connected clients.
- Basic server commands (e.g., `/exit`).
- Graceful handling of client disconnects.
- Built with **Node.js + TypeScript** and structured using OOP.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

## Usage

1. Open a terminal and connect as a client:

```bash
telnet localhost 3000
```

2. Open another terminal and connect as a client:

```bash
telnet localhost 3000
```

3. Type messages and see them broadcast to all connected clients.

4. Use /help for a list of available commands.

## TODO

- Extra: commands
  - [ ] /who (list all users)
  - [ ] /private messages
  - [ ] /block
  - [ ] /unblock
  - [ ] /ignore
  - [ ] /unignore
  - [ ] admin level
    - [ ] /kick
    - [ ] /ban
    - [ ] /mute
    - [ ] /unmute
