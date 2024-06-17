/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModuleAlreadyExistsError } from "./errors/module-already-exists-error";
import { ModulesRepository } from "./../repositories/modules-repository";
import { Modulo } from "@prisma/client";

interface ModulesUseCaseRequest {
  nome_modulo: string;
  descricao_modulo: string | null;
}

interface ModulesUseCaseResponse {
  module: Modulo;
}

export class ModulesUseCase {
  constructor(private modulesRepository: ModulesRepository) {}

  async execute({
    nome_modulo,
    descricao_modulo,
  }: ModulesUseCaseRequest): Promise<ModulesUseCaseResponse> {
    const moduleWithSameName =
      await this.modulesRepository.findByName(nome_modulo);
    if (moduleWithSameName) {
      throw new ModuleAlreadyExistsError();
    }
    const module = await this.modulesRepository.create({
      nome_modulo,
      descricao_modulo,
    });
    return { module };
  }
}
