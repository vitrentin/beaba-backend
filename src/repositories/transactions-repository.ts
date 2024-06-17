import { Prisma, Transacao } from "@prisma/client";

export interface TransactionsRepository {
  findByName(name: string): Promise<Transacao | null>;
  searchMany(query: string, page: number): Promise<Transacao[]>;
  create(data: Prisma.TransacaoCreateInput): Promise<Transacao>;
  //   create(data: Prisma.ModuloUncheckedCreateInput): Promise<Modulo>;
}
