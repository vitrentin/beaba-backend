import { PrismaTrasactionsRepository } from "@/repositories/prisma/prisma-transactions-repository";
import { TransactionsUseCase } from "./../transaction";

export function makeTransactionsUseCase() {
  const transactionsRepository = new PrismaTrasactionsRepository();
  const transactionUseCase = new TransactionsUseCase(transactionsRepository);
  return transactionUseCase;
}
