import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "../../middlewares/verify-jwt";

export async function searchFunctions(app: FastifyInstance) {
  app.post(
    "/search/functions",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const searchFunctionBody = z.object({
        search_term: z.string().optional(),
      });

      try {
        const { search_term } = searchFunctionBody.parse(request.body);

        const functions = await prisma.funcao.findMany({
          where: {
            OR: [
              {
                nome_funcao: {
                  contains: search_term,
                  mode: "insensitive",
                },
              },
              {
                descricao_funcao: {
                  contains: search_term,
                  mode: "insensitive",
                },
              },
            ],
          },
          include: {
            funcao_modulo: {
              include: {
                modulo: true,
              },
            },
          },
        });

        return reply.status(200).send(functions);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({ error: error.errors });
        }
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
