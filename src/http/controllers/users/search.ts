import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "../../middlewares/verify-jwt";

export async function searchUsers(app: FastifyInstance) {
  app.post(
    "/search/users",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const searchUserBody = z.object({
        nome_usuario: z.string().optional(),
        email: z.string().optional(),
      });

      try {
        const { nome_usuario, email } = searchUserBody.parse(request.body);

        const users = await prisma.usuario.findMany({
          where: {
            OR: [
              {
                nome_usuario: {
                  contains: nome_usuario,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: email,
                  mode: "insensitive",
                },
              },
            ],
          },
        });

        return reply.status(200).send(users);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({ error: error.errors });
        }
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
