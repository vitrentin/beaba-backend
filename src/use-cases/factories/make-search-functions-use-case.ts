import { PrismaFunctionsRepository } from "@/repositories/prisma/prisma-functions-repository";
import { SearchFunctionsUseCase } from "../search-functions";

export function makeSearchFunctionsUseCase() {
  const functionsRepository = new PrismaFunctionsRepository();
  const useCase = new SearchFunctionsUseCase(functionsRepository);
  return useCase;
}
