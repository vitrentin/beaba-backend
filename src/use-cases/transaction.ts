/* eslint-disable @typescript-eslint/no-unused-vars */
import { TransactionAlreadyExistsError } from "@/use-cases/errors/transaction-already-exists-error";
import { TransactionsRepository } from "./../repositories/transactions-repository";
import { Transacao } from "@prisma/client";

interface TransactionsUseCaseRequest {
  nome_transacao: string;
  descricao_transacao: string | null;
}

interface TransactionsUseCaseResponse {
  transaction: Transacao;
}

export class TransactionsUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    nome_transacao,
    descricao_transacao,
  }: TransactionsUseCaseRequest): Promise<TransactionsUseCaseResponse> {
    const transactionWithSameName =
      await this.transactionsRepository.findByName(nome_transacao);
    if (transactionWithSameName) {
      throw new TransactionAlreadyExistsError();
    }
    const transaction = await this.transactionsRepository.create({
      nome_transacao,
      descricao_transacao,
    });
    return { transaction };
  }
}
