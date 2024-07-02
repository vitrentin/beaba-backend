import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

export async function getTransactions(app: FastifyInstance) {
  app.get(
    "/transactions",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      try {
        const transactions = await prisma.transacao.findMany({
          orderBy: {
            id_transacao: "asc",
          },
          include: {
            transacao_modulo: {
              include: {
                modulo: true,
              },
            },
          },
        });
        // Transformar os dados para incluir a informação dos módulos
        const transactionsWithModules = transactions.map((transactions) => ({
          ...transactions,
          modules: transactions.transacao_modulo
            .map((tm) => tm.modulo.nome_modulo)
            .join(", "),
        }));

        return reply.send(transactionsWithModules);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
        return reply.code(500).send({ error: "Erro ao buscar transações" });
      }
    }
  );

  app.get(
    "/transactions/:transactionId",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const getTransactionParam = z.object({
        transactionId: z.string().refine((val) => !isNaN(Number(val)), {
          message: "transactionId must be a number",
        }),
      });

      try {
        const { transactionId } = getTransactionParam.parse(request.params);
        const id = Number(transactionId);
        const transaction = await prisma.transacao.findUnique({
          where: {
            id_transacao: id,
          },
        });

        if (!transaction) {
          return reply.status(404).send({ error: "Transaction not found" });
        }

        return reply.status(200).send(transaction);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({ error: error.errors });
        }
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
