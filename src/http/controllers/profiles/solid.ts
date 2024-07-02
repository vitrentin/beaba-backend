/* eslint-disable prettier/prettier */
import { ProfileAlreadyExistsError } from "@/use-cases/errors/profile-already-exists-erros";
import { makeProfilesUseCase } from "@/use-cases/factories/make-profile-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createProfilesBodySchema = z.object({
    nome_perfil: z.string(),
  });
  const { nome_perfil } = createProfilesBodySchema.parse(request.body);

  try {
    const createProfilesUseCase = makeProfilesUseCase();
    await createProfilesUseCase.execute({
      // userId: request.user.sub
      nome_perfil,
    });
  } catch (error) {
    if (error instanceof ProfileAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }
    throw error;
  }

  return reply.status(201).send();
}
