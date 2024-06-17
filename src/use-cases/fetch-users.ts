/* eslint-disable @typescript-eslint/no-explicit-any */
import { UsersRepository } from "@/repositories/users-repository";
import { Usuario } from "@prisma/client";

interface FetchUserUseCaseRequest {
  userId: number;
  page: number;
}

interface FetchUserUseCaseResponse {
  user: Usuario[];
}

export class FetchUser {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserUseCaseRequest): Promise<FetchUserUseCaseResponse> {
    const user = await this.usersRepository.findManyByUserId(userId, page);

    return { user };
  }
}
