/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { ModuleAlreadyExistsError } from "@/use-cases/errors/module-already-exists-error";
import { makeModulesUseCase } from "@/use-cases/factories/make-module-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createProfilesParamsSchema = z.object({
    profilesId: z.number(),
  });

  const createModulesBodySchema = z.object({
    nome_modulo: z.string(),
    descricao_modulo: z.string().nullable(),
  });
  const { profilesId } = createProfilesParamsSchema.parse(request.params);
  const { nome_modulo, descricao_modulo } = createModulesBodySchema.parse(
    request.body
  );

  try {
    const createModuleUseCase = makeModulesUseCase();
    await createModuleUseCase.execute({
      nome_modulo,
      descricao_modulo,
    });
  } catch (error) {
    if (error instanceof ModuleAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }
    throw error;
  }

  return reply.status(201).send();
}
