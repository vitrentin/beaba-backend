import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import excel from "excel4node";
export async function getModules(app: FastifyInstance) {
  app.get("/modules", { onRequest: [verifyJWT] }, async (request, reply) => {
    const modules = await prisma.modulo.findMany({
      orderBy: {
        id_modulo: "asc",
      },
    });
    const countModules = modules.length;
    return reply.status(200).send({ modules, countModules });
  });

  app.get(
    "/modules/:moduleId",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const getModuleParam = z.object({
        moduleId: z.string().refine((val) => !isNaN(Number(val)), {
          message: "moduleId must be a number",
        }),
      });

      try {
        const { moduleId } = getModuleParam.parse(request.params);
        const id = Number(moduleId);
        const module = await prisma.modulo.findUnique({
          where: {
            id_modulo: id,
          },
        });

        if (!module) {
          return reply.status(404).send({ error: "Module not found" });
        }

        return reply.status(200).send(module);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({ error: error.errors });
        }
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
  app.get(
    "/modules/report",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      try {
        const modules = await prisma.modulo.findMany({
          orderBy: {
            id_modulo: "asc",
          },
        });

        const wb = new excel.Workbook();
        const ws = wb.addWorksheet("Modules");

        const headers = ["ID", "Módulo", "Descrição"];
        ws.row(1).freeze();

        headers.forEach((header, index) => {
          ws.cell(1, index + 1).string(header);
        });

        modules.forEach((module, rowIndex) => {
          ws.cell(rowIndex + 2, 1).number(module.id_modulo);
          ws.cell(rowIndex + 2, 2).string(module.nome_modulo);
          ws.cell(rowIndex + 2, 3).string(module.descricao_modulo);
        });

        ws.column(1).setWidth(10);
        ws.column(2).setWidth(20);
        ws.column(3).setWidth(30);

        const buffer = await wb.writeToBuffer();
        reply.header(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        reply.header(
          "Content-Disposition",
          `attachment; filename="relatorio_modulos.xlsx"`
        );
        reply.send(buffer);
      } catch (error) {
        console.error("Error generating module report:", error);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
