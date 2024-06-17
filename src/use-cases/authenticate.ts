import { UsersRepository } from "@/repositories/users-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { compare } from "bcryptjs";
import { Usuario } from "@prisma/client";

interface AuthenticateUseCaseRequest {
  email: string;
  senha: string;
}

interface AuthenticateUseCaseResponse {
  user: Usuario;
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    senha,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }
    // Boolean => "is" "has" "does"
    const doesPasswordMatches = await compare(senha, user.senha_hash);
    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }
    return {
      user,
    };
  }
}
