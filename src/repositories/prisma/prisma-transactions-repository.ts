/* eslint-disable @typescript-eslint/no-unused-vars */
import { TransactionsRepository } from "./../transactions-repository";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class PrismaTrasactionsRepository implements TransactionsRepository {
  async findByName(name: string) {
    const transaction = await prisma.transacao.findUnique({
      where: {
        nome_transacao: name,
      },
    });
    return transaction;
  }

  async searchMany(query: string, page: number) {
    const trasaction = await prisma.transacao.findMany({
      where: {
        nome_transacao: {
          contains: query,
        },
      },
      take: 10,
      skip: (page - 1) * 10,
    });

    return trasaction;
  }

  async create(data: Prisma.TransacaoCreateInput) {
    const transaction = await prisma.transacao.create({
      data,
    });
    return transaction;
  }
}
