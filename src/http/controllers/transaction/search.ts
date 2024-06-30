import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "../../middlewares/verify-jwt";

export async function searchTransactions(app: FastifyInstance) {
  app.post(
    "/search/transactions",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const searchTransactionBody = z.object({
        search_term: z.string().optional(),
      });

      try {
        const { search_term } = searchTransactionBody.parse(request.body);

        const transactions = await prisma.transacao.findMany({
          where: {
            OR: [
              {
                nome_transacao: {
                  contains: search_term,
                  mode: "insensitive",
                },
              },
              {
                descricao_transacao: {
                  contains: search_term,
                  mode: "insensitive",
                },
              },
            ],
          },
          include: {
            transacao_modulo: {
              include: {
                modulo: true,
              },
            },
          },
        });

        return reply.status(200).send(transactions);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({ error: error.errors });
        }
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
