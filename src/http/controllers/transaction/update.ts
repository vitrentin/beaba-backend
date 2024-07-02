import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

type UpdateTransactionInput = {
  nome_transacao?: string;
  descricao_transacao?: string;
};

export async function updateTransactions(app: FastifyInstance) {
  app.put(
    "/transactions/:transactionId",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const updateTransactionParam = z.object({
        transactionId: z
          .string()
          .transform((val) => parseInt(val, 10))
          .refine((val) => !isNaN(val), {
            message: "transactionId must be a valid number",
          }),
      });

      const updateTransactionBody = z.object({
        nome_transacao: z.string().optional(),
        descricao_transacao: z.string().optional(),
      });

      try {
        const { transactionId } = updateTransactionParam.parse(request.params);
        const transactionData: UpdateTransactionInput =
          updateTransactionBody.parse(request.body);

        if (transactionData.nome_transacao) {
          const transactionExists = await prisma.transacao.findUnique({
            where: {
              nome_transacao: transactionData.nome_transacao,
            },
          });

          if (transactionExists) {
            return reply
              .code(400)
              .send({ error: "Transaction already in use" });
          }
        }

        const transactions = await prisma.transacao.findUnique({
          where: {
            id_transacao: transactionId,
          },
        });

        if (!transactions) {
          return reply.code(404).send({ error: "Transaction not found" });
        }

        const dataToUpdate: any = {
          nome_transacao: transactionData.nome_transacao,
          descricao_transacao: transactionData.descricao_transacao,
        };

        await prisma.transacao.update({
          where: {
            id_transacao: transactionId,
          },
          data: dataToUpdate,
        });

        return reply
          .code(200)
          .send({ message: "Transaction updated successfully" });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({ error: error.errors });
        }
        console.error("Internal Server Error:", error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    }
  );

  app.delete(
    "/transactions/:transactionId/modules/:moduleId",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const deleteModuleParam = z.object({
        transactionId: z
          .string()
          .transform((val) => parseInt(val, 10))
          .refine((val) => !isNaN(val), {
            message: "transactionId must be a valid number",
          }),
        moduleId: z
          .string()
          .transform((val) => parseInt(val, 10))
          .refine((val) => !isNaN(val), {
            message: "moduleId must be a valid number",
          }),
      });

      try {
        const { transactionId, moduleId } = deleteModuleParam.parse(
          request.params
        );

        await prisma.transacao_modulo.deleteMany({
          where: {
            transacao_id: transactionId,
            modulo_id: moduleId,
          },
        });

        return reply
          .code(200)
          .send({ message: "Module removed from transaction successfully" });
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
