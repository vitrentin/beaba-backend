/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { UsersRepository } from "@/repositories/users-repository";
import { Usuario } from "@prisma/client";

interface UpdateUseCaseRequest {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

interface UpdateUseCaseResponse {
  user: Usuario;
}

export class UpdateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
    nome,
    email,
    senha,
  }: UpdateUseCaseRequest): Promise<UpdateUseCaseResponse> {
    const user_id = await this.usersRepository.findById(id);
    if (!user_id) {
      throw new Error("User not found");
    }
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }
    const user = await this.usersRepository.update({
      id,
      nome,
      email,
      senha,
    });

    return { user };
  }
}
