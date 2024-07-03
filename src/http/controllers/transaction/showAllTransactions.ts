import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import excel from "excel4node";

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
        const transactionsWithModules = transactions.map((transaction) => ({
          ...transaction,
          modules: transaction.transacao_modulo
            .map((tm) => tm.modulo.nome_modulo)
            .join(", "),
        }));
        const countTransactions = transactions.length;
        return reply.send({ transactionsWithModules, countTransactions });
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
  app.get(
    "/transactions/report",
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

        const wb = new excel.Workbook();
        const ws = wb.addWorksheet("Transactions");

        const headers = ["ID", "Transação", "Descrição", "Módulo"];
        ws.row(1).freeze();

        headers.forEach((header, index) => {
          ws.cell(1, index + 1).string(header);
        });

        transactions.forEach((transaction, rowIndex) => {
          const modules = transaction.transacao_modulo
            .map((tm) => tm.modulo.nome_modulo)
            .join(", ");

          ws.cell(rowIndex + 2, 1).number(transaction.id_transacao);
          ws.cell(rowIndex + 2, 2).string(transaction.nome_transacao);
          ws.cell(rowIndex + 2, 3).string(transaction.descricao_transacao);
          ws.cell(rowIndex + 2, 4).string(modules);
        });

        ws.column(1).setWidth(10);
        ws.column(2).setWidth(20);
        ws.column(3).setWidth(30);
        ws.column(4).setWidth(30);

        const buffer = await wb.writeToBuffer();
        reply.header(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        reply.header(
          "Content-Disposition",
          `attachment; filename="relatorio_transacoes.xlsx"`
        );
        reply.send(buffer);
      } catch (error) {
        console.error("Error generating transaction report:", error);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
