/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash, compare } from "bcryptjs";
import { expect, describe, it, beforeEach } from "vitest";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

// Unit Test
let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;
describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });
  it("should be able to authenticate", async () => {
    await usersRepository.create({
      nome_usuario: "John Doe",
      email: "jhondoe@example.com",
      senha_hash: await hash("123456", 3),
    });

    const { user } = await sut.execute({
      email: "jhondoe@example.com",
      senha: "123456",
    });

    expect(user.id_usuario).toEqual(expect.any(Number));
  });
  it("should not be able to authenticate with wrong email", async () => {
    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        senha: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong email", async () => {
    await usersRepository.create({
      nome_usuario: "John Doe",
      email: "johndoe@example.com",
      senha_hash: await hash("123456", 3),
    });

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        senha: "123123",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
