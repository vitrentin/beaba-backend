import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { GetTotalUser } from "./get-total-users";

let usersRepository: InMemoryUsersRepository;
let sut: GetTotalUser;

describe("Get Total User Use Case", () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetTotalUser(usersRepository);
  });

  it("should be able to get users count", async () => {
    await usersRepository.create({
      nome_usuario: "Joao",
      email: "joao@teste.com",
      senha_hash: "123321",
    });

    await usersRepository.create({
      nome_usuario: "Vinicius",
      email: "vinicius@teste.com",
      senha_hash: "123321",
    });

    const { totalUsers } = await sut.execute({
      userId: 1,
    });

    expect(totalUsers).toEqual(1);
  });
});
