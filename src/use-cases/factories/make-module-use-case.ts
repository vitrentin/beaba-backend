import { PrismaModulesRepository } from "@/repositories/prisma/prisma-modules-repository";
import { ModulesUseCase } from "./../modules";

export function makeModulesUseCase() {
  const modulesRepository = new PrismaModulesRepository();
  const modulesUseCase = new ModulesUseCase(modulesRepository);
  return modulesUseCase;
}
