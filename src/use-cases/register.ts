/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { UsersRepository } from "@/repositories/users-repository";
import { Usuario } from "@prisma/client";
import { hash } from "bcryptjs";

interface RegisterUseCaseRequest {
  nome: string;
  email: string;
  senha: string;
  perfil_id: number;
}

interface RegisterUseCaseResponse {
  user: Usuario;
}

// SOLID
// D - Dependency Inversion Principle
// Princípio de Inversão de Dependência
export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    nome,
    email,
    senha,
    perfil_id,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const senha_hash = await hash(senha, 3);
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }
    const user = await this.usersRepository.create({
      nome_usuario: nome,
      email,
      senha_hash,
      perfil: {
        connect: { id_perfil: perfil_id },
      },
    });
    return { user };
  }
}
