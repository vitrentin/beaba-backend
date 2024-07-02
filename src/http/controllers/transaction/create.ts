import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

export async function createTransaction(app: FastifyInstance) {
  app.post(
    "/transaction",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const createTransactionBody = z.object({
        nome_transacao: z.string(),
        descricao_transacao: z.string().optional(),
        nome_modulo: z.string().optional(),
      });

      try {
        const transactionData = createTransactionBody.parse(request.body);

        // Verificar se a transação já existe somente se nome_modulo não estiver definido
        let transaction = await prisma.transacao.findUnique({
          where: { nome_transacao: transactionData.nome_transacao },
        });

        if (!transaction) {
          transaction = await prisma.transacao.create({
            data: {
              nome_transacao: transactionData.nome_transacao,
              descricao_transacao: transactionData.descricao_transacao,
            },
          });
        } else if (!isDefined(transactionData.nome_modulo)) {
          return reply.code(400).send({ error: "Transação já existe" });
        }

        if (isDefined(transactionData.nome_modulo)) {
          // Verificar se o módulo existe
          const module = await prisma.modulo.findUnique({
            where: { nome_modulo: transactionData.nome_modulo },
          });

          if (!module) {
            return reply.code(400).send({ error: "Módulo não encontrado" });
          }

          // Verificar se a associação já existe
          const existingAssociation = await prisma.transacao_modulo.findFirst({
            where: {
              transacao_id: transaction.id_transacao,
              modulo_id: module.id_modulo,
            },
          });

          if (existingAssociation) {
            return reply
              .code(400)
              .send({ error: "Transação e módulo já associados" });
          }

          // Criar a associação
          await prisma.transacao_modulo.create({
            data: {
              transacao_id: transaction.id_transacao,
              modulo_id: module.id_modulo,
            },
          });
        }

        return reply
          .code(201)
          .send({ message: "Transação criada e/ou associada com sucesso" });
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

// Guarda de tipo para garantir que um valor não seja undefined
function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}
