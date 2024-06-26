/* eslint-disable @typescript-eslint/no-explicit-any */
import { UsersRepository } from "@/repositories/users-repository";
// import { Usuario } from "@prisma/client";

interface DeleteUseCaseRequest {
  id: number;
}

interface DeleteUseCaseResponse {
  userId: boolean;
}

export class DeleteUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id }: DeleteUseCaseRequest): Promise<DeleteUseCaseResponse> {
    const user_id = await this.usersRepository.findById(id);
    if (!user_id) {
      throw new Error("User not found");
    }

    const userId = await this.usersRepository.delete(id);

    return { userId };
  }
}
