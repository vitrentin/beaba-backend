/* eslint-disable prettier/prettier */
import { makeSearchFunctionsUseCase } from "@/use-cases/factories/make-search-functions-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchFunctionsQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });
  const { query, page } = searchFunctionsQuerySchema.parse(request.query);

  const searchFunctionsUseCase = makeSearchFunctionsUseCase();

  const { functions } = await searchFunctionsUseCase.execute({
    query,
    page,
  });

  return reply.status(200).send({
    functions,
  });
}
