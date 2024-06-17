export class FunctionAlreadyExistsError extends Error {
  constructor() {
    super("Function already exists.");
  }
}
