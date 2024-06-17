/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionsRepository } from "./../repositories/functions-repository";
import { Funcao } from "@prisma/client";

interface SearchFunctionsUseCaseRequest {
  query: string;
  page: number;
}

interface SearchFunctionsUseCaseResponse {
  functions: Funcao[];
}

export class SearchFunctionsUseCase {
  constructor(private functionsRepository: FunctionsRepository) {}

  async execute({
    query,
    page,
  }: SearchFunctionsUseCaseRequest): Promise<SearchFunctionsUseCaseResponse> {
    const functions = await this.functionsRepository.searchMany(query, page);
    return { functions };
  }
}
