/* eslint-disable @typescript-eslint/no-explicit-any */
import { UsersRepository } from "@/repositories/users-repository";
import { Usuario } from "@prisma/client";

interface SearchUsersUseCaseRequest {
  query: string;
  page: number;
}

interface SearchUsersUseCaseResponse {
  user: Usuario[];
}

// SOLID
// D - Dependency Inversion Principle
// Princípio de Inversão de Dependência
export class SearchUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    query,
    page,
  }: SearchUsersUseCaseRequest): Promise<SearchUsersUseCaseResponse> {
    // const prismaUsersRepository = new PrismaUsersRepository();
    const user = await this.usersRepository.searchMany(query, page);
    return { user };
  }
}
