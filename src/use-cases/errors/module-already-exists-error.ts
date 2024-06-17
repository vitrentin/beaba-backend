export class ModuleAlreadyExistsError extends Error {
  constructor() {
    super("Module already exists.");
  }
}
