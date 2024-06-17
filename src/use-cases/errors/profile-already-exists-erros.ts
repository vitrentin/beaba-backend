export class ProfileAlreadyExistsError extends Error {
  constructor() {
    super("Profile already exists.");
  }
}
