export class NoNameProvidedError extends Error {
  constructor(message: string = "") {
    super(message);
  }
}

export class NameAlreadyInUseError extends Error {
  constructor(message: string = "") {
    super(message);
  }
}
