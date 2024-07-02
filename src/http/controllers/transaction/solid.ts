/* eslint-disable prettier/prettier */
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { TransactionAlreadyExistsError } from "@/use-cases/errors/transaction-already-exists-error";
import { makeTransactionsUseCase } from "@/use-cases/factories/make-transactions-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const transactionBodySchema = z.object({
    nome_transacao: z.string(),
    descricao_transacao: z.string().nullable(),
  });
  const { nome_transacao, descricao_transacao } = transactionBodySchema.parse(
    request.body
  );

  try {
    const transactionUseCase = makeTransactionsUseCase();
    await transactionUseCase.execute({
      nome_transacao,
      descricao_transacao,
    });
  } catch (error) {
    if (error instanceof TransactionAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }
    throw error;
  }

  return reply.status(201).send();
}
