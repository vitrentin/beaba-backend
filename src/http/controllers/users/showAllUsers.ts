import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "../../middlewares/verify-jwt";
export async function getUsers(app: FastifyInstance) {
  app.get("/users", { onRequest: [verifyJWT] }, async (request, reply) => {
    try {
      const users = await prisma.usuario.findMany({
        orderBy: {
          id_usuario: "asc",
        },
      });

      return reply.status(200).send(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  app.get(
    "/users/:userId",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
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
    }
  );
}
