import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { SearchUsersUseCase } from "./search-users";

let usersRepository: InMemoryUsersRepository;
let sut: SearchUsersUseCase;

describe("Search Users Use Case", () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    sut = new SearchUsersUseCase(usersRepository);
  });

  it("should be able to search users", async () => {
    await usersRepository.create({
      nome_usuario: "Vinicius",
      email: "vinicius@teste.com",
      senha_hash: "123321",
      created_at: new Date(),
    });

    await usersRepository.create({
      nome_usuario: "Joao",
      email: "joao@teste.com",
      senha_hash: "123321",
      created_at: new Date(),
    });

    const { user } = await sut.execute({
      query: "Vinicius",
      page: 1,
    });

    expect(user).toHaveLength(1);
    expect(user).toEqual([
      expect.objectContaining({ nome_usuario: "Vinicius" }),
    ]);
  });

  it("should be able to fetch paginated users search", async () => {
    for (let i = 1; i <= 12; i++) {
      await usersRepository.create({
        nome_usuario: `Joao${i}`,
        email: `joao${i}@teste.com`,
        senha_hash: "123321",
      });
    }

    const { user } = await sut.execute({
      query: "Joao",
      page: 2,
    });

    expect(user).toHaveLength(2);
    expect(user).toEqual([
      expect.objectContaining({ nome_usuario: "Joao11" }),
      expect.objectContaining({ nome_usuario: "Joao12" }),
    ]);
  });
});
