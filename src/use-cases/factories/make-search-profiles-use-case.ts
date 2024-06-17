import { PrismaProfilesRepository } from "@/repositories/prisma/prisma-profiles-repository";
import { SearchProfilesUseCase } from "../search-profiles";

export function makeSearchProfilesUseCase() {
  const profilesRepository = new PrismaProfilesRepository();
  const useCase = new SearchProfilesUseCase(profilesRepository);
  return useCase;
}
