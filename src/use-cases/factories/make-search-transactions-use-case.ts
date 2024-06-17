import { PrismaTrasactionsRepository } from "@/repositories/prisma/prisma-transactions-repository";
import { SearchTransactionsUseCase } from "../search-transactions";

export function makeSearchTransactionsUseCase() {
  const transactionsRepository = new PrismaTrasactionsRepository();
  const useCase = new SearchTransactionsUseCase(transactionsRepository);
  return useCase;
}
