import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

export async function getModules(app: FastifyInstance) {
  app.get("/modules", { onRequest: [verifyJWT] }, async (request, reply) => {
    const modules = await prisma.modulo.findMany();
    return reply.status(200).send(modules);
  });

  app.get(
    "/modules/:moduleId",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const getModuleParam = z.object({
        moduleId: z.string().refine((val) => !isNaN(Number(val)), {
          message: "moduleId must be a number",
        }),
      });

      try {
        const { moduleId } = getModuleParam.parse(request.params);
        const id = Number(moduleId);
        const module = await prisma.modulo.findUnique({
          where: {
            id_modulo: id,
          },
        });

        if (!module) {
          return reply.status(404).send({ error: "Module not found" });
        }

        return reply.status(200).send(module);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({ error: error.errors });
        }
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
