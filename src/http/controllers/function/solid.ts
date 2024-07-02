/* eslint-disable prettier/prettier */
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { FunctionAlreadyExistsError } from "@/use-cases/errors/function-already-exists-error";
import { makeFunctionsUseCase } from "@/use-cases/factories/make-functions-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const functionsBodySchema = z.object({
    nome_funcao: z.string(),
    descricao_funcao: z.string().nullable(),
  });
  const { nome_funcao, descricao_funcao } = functionsBodySchema.parse(
    request.body
  );

  try {
    const functionUseCase = makeFunctionsUseCase();
    await functionUseCase.execute({
      nome_funcao,
      descricao_funcao,
    });
  } catch (error) {
    if (error instanceof FunctionAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }
    throw error;
  }

  return reply.status(201).send();
}
