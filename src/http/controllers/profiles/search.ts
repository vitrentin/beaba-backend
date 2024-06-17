/* eslint-disable prettier/prettier */
import { makeSearchProfilesUseCase } from "@/use-cases/factories/make-search-profiles-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchProfilesQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });
  const { query, page } = searchProfilesQuerySchema.parse(request.query);

  const searchProfilesUseCase = makeSearchProfilesUseCase();

  const { profile } = await searchProfilesUseCase.execute({
    query,
    page,
  });

  return reply.status(200).send({
    profile,
  });
}
