import { PrismaModulesRepository } from "@/repositories/prisma/prisma-modules-repository";
import { SearchModulesUseCase } from "../search-modules";

export function makeSearchModulesUseCase() {
  const modulesRepository = new PrismaModulesRepository();
  const useCase = new SearchModulesUseCase(modulesRepository);
  return useCase;
}
