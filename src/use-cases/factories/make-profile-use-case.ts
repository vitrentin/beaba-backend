import { PrismaProfilesRepository } from "@/repositories/prisma/prisma-profiles-repository";
import { ProfilesUseCase } from "./../profiles";

export function makeProfilesUseCase() {
  const profilesRepository = new PrismaProfilesRepository();
  const profilesUseCase = new ProfilesUseCase(profilesRepository);
  return profilesUseCase;
}
