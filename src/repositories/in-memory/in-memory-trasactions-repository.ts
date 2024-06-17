import { Prisma, Transacao } from "@prisma/client";
import { TransactionsRepository } from "../transactions-repository";
import { randomInt } from "node:crypto";

export class InMemoryTransactionsRepository implements TransactionsRepository {
  public items: Transacao[] = [];

  async findByName(name: string) {
    const transaction = this.items.find((item) => item.nome_transacao === name);
    if (!transaction) {
      return null;
    }
    return transaction;
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((items) => items.nome_transacao.includes(query))
      .slice((page - 1) * 10, page * 10);
  }

  async create(data: Prisma.TransacaoCreateInput) {
    const transaction = {
      id_transacao: randomInt(100),
      nome_transacao: data.nome_transacao,
      descricao_transacao: data.descricao_transacao
        ? data.descricao_transacao
        : null,
    };

    this.items.push(transaction);

    return transaction;
  }
}
