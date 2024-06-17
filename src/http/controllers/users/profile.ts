/* eslint-disable prettier/prettier */
import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-get-use-profile-use-case";
import { FastifyRequest, FastifyReply } from "fastify";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCase();
  const { user } = await getUserProfile.execute({
    userId: Number(request.user.sub),
  });

  return reply.status(200).send({
    user: {
      ...user,
      senha_hash: undefined,
    },
  });
}
