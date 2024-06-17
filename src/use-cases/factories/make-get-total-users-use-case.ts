import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { GetTotalUser } from "../get-total-users";

export function makeGetTotalUserUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new GetTotalUser(usersRepository);
  return useCase;
}
