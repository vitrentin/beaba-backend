import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    nome_usuario: z.string(),
    email: z.string().email(),
    senha: z.string().min(6),
    perfil_id: z.number(),
  });
  const { nome_usuario, email, senha, perfil_id } = registerBodySchema.parse(
    request.body
  );

  try {
    const registerUseCase = makeRegisterUseCase();
    await registerUseCase.execute({
      nome: nome_usuario,
      email,
      senha,
      perfil_id,
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }
    throw error;
  }

  return reply.status(201).send();
}
