/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryModulesRepository } from "@/repositories/in-memory/in-memory-modules-repository";
import { ModulesUseCase } from "./modules";

// Unit Test
let modulesRepository: InMemoryModulesRepository;
let sut: ModulesUseCase;
describe("Module Use Case", () => {
  beforeEach(() => {
    modulesRepository = new InMemoryModulesRepository();
    sut = new ModulesUseCase(modulesRepository);
  });
  it("should be able to register module", async () => {
    const { module } = await sut.execute({
      nome_modulo: "CA",
      descricao_modulo: "Cadastro",
    });

    expect(module.id_modulo).toEqual(expect.any(Number));
  });
});
