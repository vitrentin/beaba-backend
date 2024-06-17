import { Prisma, Funcao } from "@prisma/client";

export interface FunctionsRepository {
  findByName(name: string): Promise<Funcao | null>;
  searchMany(query: string, page: number): Promise<Funcao[]>;
  create(data: Prisma.FuncaoCreateInput): Promise<Funcao>;
  //   create(data: Prisma.ModuloUncheckedCreateInput): Promise<Modulo>;
}
