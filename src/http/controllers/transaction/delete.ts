import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

export async function deleteTransaction(app: FastifyInstance) {
  // Rota para deletar uma transação e suas associações
  app.delete(
    "/transactions/:transactionId",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
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
        // Verifica se a transação existe
        const transaction = await prisma.transacao.findUnique({
          where: {
            id_transacao: transactionId,
          },
        });

        if (!transaction) {
          return reply.code(404).send({ error: "Transaction not found" });
        }

        // Deleta todas as associações na tabela transacao_modulo
        await prisma.transacao_modulo.deleteMany({
          where: {
            transacao_id: transactionId,
          },
        });

        // Deleta a transação
        await prisma.transacao.delete({
          where: {
            id_transacao: transactionId,
          },
        });

        return reply.code(200).send({
          message: "Transaction and its associations deleted successfully",
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({ error: error.errors });
        }
        console.error("Internal Server Error:", error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
