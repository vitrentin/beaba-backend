import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

export async function deleteUsers(app: FastifyInstance) {
  app.delete(
    "/users/:userId",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const deleteUserParam = z.object({
        userId: z
          .string()
          .transform((val) => parseInt(val, 10))
          .refine((val) => !isNaN(val), {
            message: "userId must be a valid number",
          }),
      });

      try {
        const { userId } = deleteUserParam.parse(request.params);
        const user = await prisma.usuario.findUnique({
          where: {
            id_usuario: userId,
          },
        });

        if (!user) {
          return reply.code(404).send({ error: "User not found" });
        }

        await prisma.usuario.delete({
          where: {
            id_usuario: userId,
          },
        });

        return reply.code(204).send();
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({ error: error.errors });
        }
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
