/* eslint-disable prettier/prettier */
import { makeSearchModulesUseCase } from "@/use-cases/factories/make-search-modules-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchModulesQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });
  const { query, page } = searchModulesQuerySchema.parse(request.query);

  const searchModulesUseCase = makeSearchModulesUseCase();

  const { module } = await searchModulesUseCase.execute({
    query,
    page,
  });

  return reply.status(200).send({
    module,
  });
}
