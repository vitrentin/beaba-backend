import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { FetchUser } from "../fetch-users";

export function makeFetchUsersUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new FetchUser(usersRepository);
  return useCase;
}
