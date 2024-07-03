import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import excel from "excel4node";

export async function getFunctions(app: FastifyInstance) {
  app.get("/functions", { onRequest: [verifyJWT] }, async (request, reply) => {
    try {
      const functions = await prisma.funcao.findMany({
        orderBy: {
          id_funcao: "asc",
        },
        include: {
          funcao_modulo: {
            include: {
              modulo: true,
            },
          },
        },
      });
      // Transformar os dados para incluir a informação dos módulos
      const functionsWithModules = functions.map((functions) => ({
        ...functions,
        modules: functions.funcao_modulo
          .map((fm) => fm.modulo.nome_modulo)
          .join(", "),
      }));
      const countFunctions = functions.length;
      return reply.send({ functionsWithModules, countFunctions });
    } catch (error) {
      console.error("Erro ao buscar funções:", error);
      return reply.code(500).send({ error: "Erro ao buscar funções" });
    }
  });

  app.get(
    "/functions/:functionId",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const getFunctionParam = z.object({
        functionId: z.string().refine((val) => !isNaN(Number(val)), {
          message: "functionId must be a number",
        }),
      });

      try {
        const { functionId } = getFunctionParam.parse(request.params);
        const id = Number(functionId);
        const functions = await prisma.funcao.findUnique({
          where: {
            id_funcao: id,
          },
        });

        if (!functions) {
          return reply.status(404).send({ error: "Function not found" });
        }

        return reply.status(200).send(functions);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({ error: error.errors });
        }
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
  app.get(
    "/functions/report",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      try {
        const functions = await prisma.funcao.findMany({
          orderBy: {
            id_funcao: "asc",
          },
          include: {
            funcao_modulo: {
              include: {
                modulo: true,
              },
            },
          },
        });

        const wb = new excel.Workbook();
        const ws = wb.addWorksheet("Functions");

        const headers = ["ID", "Função", "Descrição", "Módulo(s)"];
        ws.row(1).freeze();

        headers.forEach((header, index) => {
          ws.cell(1, index + 1).string(header);
        });

        functions.forEach((functions, rowIndex) => {
          const modules = functions.funcao_modulo
            .map((fm) => fm.modulo.nome_modulo)
            .join(", ");

          ws.cell(rowIndex + 2, 1).number(functions.id_funcao);
          ws.cell(rowIndex + 2, 2).string(functions.nome_funcao);
          ws.cell(rowIndex + 2, 3).string(functions.descricao_funcao);
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
          `attachment; filename="relatorio_funcoes.xlsx"`
        );
        reply.send(buffer);
      } catch (error) {
        console.error("Error generating function report:", error);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
