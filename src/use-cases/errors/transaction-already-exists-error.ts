export class TransactionAlreadyExistsError extends Error {
  constructor() {
    super("Transaction already exists.");
  }
}
