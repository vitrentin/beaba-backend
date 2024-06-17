/* eslint-disable @typescript-eslint/no-explicit-any */
import { ModulesRepository } from "@/repositories/modules-repository";
import { Modulo } from "@prisma/client";

interface SearchModulesUseCaseRequest {
  query: string;
  page: number;
}

interface SearchModulesUseCaseResponse {
  module: Modulo[];
}

export class SearchModulesUseCase {
  constructor(private modulesRepository: ModulesRepository) {}

  async execute({
    query,
    page,
  }: SearchModulesUseCaseRequest): Promise<SearchModulesUseCaseResponse> {
    // const prismaUsersRepository = new PrismaUsersRepository();
    const module = await this.modulesRepository.searchMany(query, page);
    return { module };
  }
}
