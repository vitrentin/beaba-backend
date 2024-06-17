import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { UsersRepository } from "@/repositories/users-repository";
import { Usuario } from "@prisma/client";

interface GetUserProfileUseCaseRequest {
  userId: number;
}

interface GetUserProfileUseCaseResponse {
  user: Usuario;
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new ResourceNotFoundError();
    }

    return {
      user,
    };
  }
}
