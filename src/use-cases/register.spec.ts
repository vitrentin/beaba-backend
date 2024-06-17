/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { compare } from "bcryptjs";
import { expect, describe, it, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

// Unit Test
let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;
describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });
  it("should be able to register", async () => {
    const { user } = await sut.execute({
      nome: "John Doe",
      email: "johndoe@example.com",
      senha: "123456",
    });

    expect(user.id_usuario).toEqual(expect.any(Number));
  });
  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      nome: "John Doe",
      email: "johndoe@example.com",
      senha: "123456",
    });

    const isPasswordCorrectlyHashed = await compare("123456", user.senha_hash);
    expect(isPasswordCorrectlyHashed).toBe(true);
  });
  it("should not be able to register with same email twice", async () => {
    const email = "johndoe@example.com";

    await sut.execute({
      nome: "John Doe",
      email,
      senha: "123456",
    });

    await expect(() =>
      sut.execute({
        nome: "John Doe",
        email,
        senha: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
