import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export async function getUsers(app: FastifyInstance) {
  app.get("/users", async (request, reply) => {
    const users = await prisma.usuario.findMany();
    return reply.status(200).send(users);
  });

  app.get("/users/:userId", async (request, reply) => {
    const getUserParam = z.object({
      userId: z.string().refine((val) => !isNaN(Number(val)), {
        message: "userId must be a number",
      }),
    });

    try {
      const { userId } = getUserParam.parse(request.params);
      const id = Number(userId);
      const user = await prisma.usuario.findUnique({
        where: {
          id_usuario: id,
        },
      });

      if (!user) {
        return reply.status(404).send({ error: "User not found" });
      }

      return reply.status(200).send(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors });
      }
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });
}
