/* eslint-disable @typescript-eslint/no-explicit-any */
import { UsersRepository } from "@/repositories/users-repository";

interface GetTotalUserUseCaseRequest {
  userId: number;
}

interface GetTotalUserUseCaseResponse {
  totalUsers: number;
}

export class GetTotalUser {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetTotalUserUseCaseRequest): Promise<GetTotalUserUseCaseResponse> {
    const totalUsers = await this.usersRepository.countByUserId(userId);

    return {
      totalUsers,
    };
  }
}
