/* eslint-disable prettier/prettier */
import { FastifyReply, FastifyRequest } from "fastify";

export function verifyUserProfile(profileToVerify: 1 | 2) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { perfil_id } = request.user;

    if (perfil_id !== profileToVerify) {
      return reply.status(401).send({ message: "Unauthorized" });
    }
  };
}
