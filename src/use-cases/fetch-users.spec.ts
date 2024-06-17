// /* eslint-disable prettier/prettier */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
// import { expect, describe, it, beforeEach } from "vitest";
// import { FetchUser } from "./fetch-users";

// // Unit Test
// let usersRepository: InMemoryUsersRepository;
// let sut: FetchUser;
// describe("Fetch User Use Case", () => {
//   beforeEach(() => {
//     usersRepository = new InMemoryUsersRepository();
//     sut = new FetchUser(usersRepository);
//   });
//   it("should be able to fetch users", async () => {
//     await usersRepository.create({
//       nome_usuario: "Joao",
//       email: "joao@teste.com",
//       senha_hash: "123321",
//     });
//     await usersRepository.create({
//       nome_usuario: "Pedro",
//       email: "pedro@teste.com",
//       senha_hash: "123321",
//     });
//     const { user } = await sut.execute({
//       userId: 1,
//       page: 1,
//     });

//     expect(user).toHaveLength(2);
//     expect(user).toEqual([
//       expect.objectContaining({ id_usuario: 1 }),
//       expect.objectContaining({ id_usuario: 2 }),
//     ]);
//   });
//   it("should be able to fetch paginated users", async () => {
//     for (let i = 10; i <= 12; i++) {
//       await usersRepository.create({
//         nome_usuario: "Joao",
//         email: `Joao${i}@teste.com`,
//         senha_hash: "123321",
//       });
//     }
//     const { user } = await sut.execute({
//       userId: 1,
//       page: 2,
//     });

//     expect(user).toHaveLength(2);
//     expect(user).toEqual([
//       expect.objectContaining({ id_usuario: 11 }),
//       expect.objectContaining({ id_usuario: 12 }),
//     ]);
//   });
// });
/* eslint-disable @typescript-eslint/no-explicit-any */
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
