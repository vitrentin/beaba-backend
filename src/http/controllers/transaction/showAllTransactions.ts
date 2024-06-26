import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export async function getTransactions(app: FastifyInstance) {
  app.get("/transactions", async (request, reply) => {
    const transactions = await prisma.transacao.findMany();
    return reply.status(200).send(transactions);
  });

  app.get("/transactions/:transactionId", async (request, reply) => {
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
  });
}
