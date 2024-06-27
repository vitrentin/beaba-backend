import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

export async function deleteModules(app: FastifyInstance) {
  app.delete(
    "/modules/:moduleId",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const deleteModuleParam = z.object({
        moduleId: z
          .string()
          .transform((val) => parseInt(val, 10))
          .refine((val) => !isNaN(val), {
            message: "moduleId must be a valid number",
          }),
      });

      try {
        const { moduleId } = deleteModuleParam.parse(request.params);
        const module = await prisma.modulo.findUnique({
          where: {
            id_modulo: moduleId,
          },
        });

        if (!module) {
          return reply.code(404).send({ error: "Module not found" });
        }

        await prisma.modulo.delete({
          where: {
            id_modulo: moduleId,
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
