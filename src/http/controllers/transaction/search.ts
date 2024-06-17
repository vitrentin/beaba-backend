/* eslint-disable prettier/prettier */
import { makeSearchTransactionsUseCase } from "@/use-cases/factories/make-search-transactions-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchTransactionsQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });
  const { query, page } = searchTransactionsQuerySchema.parse(request.query);

  const searchTransactionsUseCase = makeSearchTransactionsUseCase();

  const { transaction } = await searchTransactionsUseCase.execute({
    query,
    page,
  });

  return reply.status(200).send({
    transaction,
  });
}
