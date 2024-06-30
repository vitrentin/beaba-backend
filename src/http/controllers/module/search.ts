import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "../../middlewares/verify-jwt";

export async function searchModules(app: FastifyInstance) {
  app.post(
    "/search/modules",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const searchModuleBody = z.object({
        search_term: z.string().optional(),
      });

      try {
        const { search_term } = searchModuleBody.parse(request.body);

        const modules = await prisma.modulo.findMany({
          where: {
            OR: [
              {
                nome_modulo: {
                  contains: search_term,
                  mode: "insensitive",
                },
              },
              {
                descricao_modulo: {
                  contains: search_term,
                  mode: "insensitive",
                },
              },
            ],
          },
        });

        return reply.status(200).send(modules);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({ error: error.errors });
        }
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
