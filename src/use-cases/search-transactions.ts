/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransactionsRepository } from "./../repositories/transactions-repository";
import { Transacao } from "@prisma/client";

interface SearchTransactionsUseCaseRequest {
  query: string;
  page: number;
}

interface SearchTransactionsUseCaseResponse {
  transaction: Transacao[];
}

export class SearchTransactionsUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    query,
    page,
  }: SearchTransactionsUseCaseRequest): Promise<SearchTransactionsUseCaseResponse> {
    const transaction = await this.transactionsRepository.searchMany(
      query,
      page
    );
    return { transaction };
  }
}
