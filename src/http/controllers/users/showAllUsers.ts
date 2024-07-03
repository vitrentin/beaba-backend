import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "../../middlewares/verify-jwt";
import excel from "excel4node";

export async function getUsers(app: FastifyInstance) {
  app.get("/users", { onRequest: [verifyJWT] }, async (request, reply) => {
    try {
      const users = await prisma.usuario.findMany({
        orderBy: {
          id_usuario: "asc",
        },
      });
      const countUsers = users.length;
      return reply.status(200).send({ users, countUsers });
    } catch (error) {
      console.error("Error fetching users:", error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  app.get(
    "/users/:userId",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const getUserParam = z.object({
        userId: z.string().refine((val) => !isNaN(Number(val)), {
          message: "userId must be a number",
        }),
      });

      try {
        const { userId } = getUserParam.parse(request.params);
        const id = Number(userId);
        const user = await prisma.usuario.findUnique({
          where: {
            id_usuario: id,
          },
        });

        if (!user) {
          return reply.status(404).send({ error: "User not found" });
        }

        return reply.status(200).send(user);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({ error: error.errors });
        }
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
  app.get(
    "/users/report",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      try {
        const users = await prisma.usuario.findMany({
          orderBy: {
            id_usuario: "asc",
          },
        });

        const wb = new excel.Workbook();
        const ws = wb.addWorksheet("Users");

        const headers = [
          "ID",
          "Nome",
          "Email",
          "Criado em",
          "Atualizado em",
          "Perfil ID",
        ];
        ws.row(1).freeze();

        headers.forEach((header, index) => {
          ws.cell(1, index + 1).string(header);
        });

        users.forEach((user, rowIndex) => {
          ws.cell(rowIndex + 2, 1).number(user.id_usuario);
          ws.cell(rowIndex + 2, 2).string(user.nome_usuario);
          ws.cell(rowIndex + 2, 3).string(user.email);
          ws.cell(rowIndex + 2, 4).date(user.created_at);

          if (user.updated_at) {
            ws.cell(rowIndex + 2, 5).date(user.updated_at);
          } else {
            ws.cell(rowIndex + 2, 5).string("");
          }

          ws.cell(rowIndex + 2, 6).number(user.perfil_id);
        });

        ws.column(1).setWidth(10);
        ws.column(2).setWidth(20);
        ws.column(3).setWidth(30);
        ws.column(4).setWidth(20);
        ws.column(5).setWidth(20);
        ws.column(6).setWidth(15);

        const buffer = await wb.writeToBuffer();
        reply.header(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        reply.header(
          "Content-Disposition",
          `attachment; filename="relatorio_usuarios.xlsx"`
        );
        reply.send(buffer);
      } catch (error) {
        console.error("Error generating user report:", error);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
