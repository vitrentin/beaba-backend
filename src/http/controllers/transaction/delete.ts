import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export async function deleteTransaction(app: FastifyInstance) {
  app.delete("/transactions/:transactionId", async (request, reply) => {
    const deleteTransactionParam = z.object({
      transactionId: z
        .string()
        .transform((val) => parseInt(val, 10))
        .refine((val) => !isNaN(val), {
          message: "transactionId must be a valid number",
        }),
    });

    try {
      const { transactionId } = deleteTransactionParam.parse(request.params);
      const transaction = await prisma.transacao.findUnique({
        where: {
          id_transacao: transactionId,
        },
      });

      if (!transaction) {
        return reply.code(404).send({ error: "Transaction not found" });
      }

      await prisma.transacao.delete({
        where: {
          id_transacao: transactionId,
        },
      });

      return reply.code(204).send();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: error.errors });
      }
      return reply.code(500).send({ error: "Internal Server Error" });
    }
  });
}
