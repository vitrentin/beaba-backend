/* eslint-disable @typescript-eslint/no-unused-vars */
import { FunctionAlreadyExistsError } from "./errors/function-already-exists-error";
import { FunctionsRepository } from "./../repositories/functions-repository";
import { Funcao } from "@prisma/client";

interface FunctionsUseCaseRequest {
  nome_funcao: string;
  descricao_funcao: string | null;
}

interface FunctionsUseCaseResponse {
  functions: Funcao;
}

export class FunctionsUseCase {
  constructor(private functionsRepository: FunctionsRepository) {}

  async execute({
    nome_funcao,
    descricao_funcao,
  }: FunctionsUseCaseRequest): Promise<FunctionsUseCaseResponse> {
    const functionWithSameName =
      await this.functionsRepository.findByName(nome_funcao);
    if (functionWithSameName) {
      throw new FunctionAlreadyExistsError();
    }
    const functions = await this.functionsRepository.create({
      nome_funcao,
      descricao_funcao,
    });
    return { functions };
  }
}
