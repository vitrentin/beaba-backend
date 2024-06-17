import { Prisma, Usuario } from "@prisma/client";

export interface UsersRepository {
  findById(id: number): Promise<Usuario | null>;
  findManyByUserId(userId: number, page: number): Promise<Usuario[]>;
  searchMany(query: string, page: number): Promise<Usuario[]>;
  countByUserId(userId: number): Promise<number>;
  findByEmail(email: string): Promise<Usuario | null>;
  create(data: Prisma.UsuarioCreateInput): Promise<Usuario>;
}
