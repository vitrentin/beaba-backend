/* eslint-disable @typescript-eslint/no-explicit-any */
import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { Usuario } from "@prisma/client";

interface RegisterUseCaseRequest {
  nome: string;
  email: string;
  senha: string;
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
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const senha_hash = await hash(senha, 3);
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
      // return reply.status(409).send(); // HTTP
    }
    // const prismaUsersRepository = new PrismaUsersRepository();
    const user = await this.usersRepository.create({
      nome_usuario: nome,
      email,
      senha_hash,
    });
    return { user };
  }
}
