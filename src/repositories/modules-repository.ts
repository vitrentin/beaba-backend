import { Prisma, Modulo } from "@prisma/client";

export interface ModulesRepository {
  findByName(name: string): Promise<Modulo | null>;
  searchMany(query: string, page: number): Promise<Modulo[]>;
  create(data: Prisma.ModuloCreateInput): Promise<Modulo>;
  //   create(data: Prisma.ModuloUncheckedCreateInput): Promise<Modulo>;
}
