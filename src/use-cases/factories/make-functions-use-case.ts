import { PrismaFunctionsRepository } from "@/repositories/prisma/prisma-functions-repository";
import { FunctionsUseCase } from "./../function";

export function makeFunctionsUseCase() {
  const functionsRepository = new PrismaFunctionsRepository();
  const functionsUseCase = new FunctionsUseCase(functionsRepository);
  return functionsUseCase;
}
