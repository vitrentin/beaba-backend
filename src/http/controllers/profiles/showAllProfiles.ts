import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import excel from "excel4node";

export async function getProfiles(app: FastifyInstance) {
  app.get("/profiles", { onRequest: [verifyJWT] }, async (request, reply) => {
    try {
      const profiles = await prisma.perfil.findMany({
        orderBy: {
          id_perfil: "asc",
        },
        include: {
          perfil_modulo: {
            include: {
              modulo: true,
            },
          },
        },
      });
      // Transformar os dados para incluir a informação dos módulos
      const profilesWithModules = profiles.map((profile) => ({
        ...profile,
        modules: profile.perfil_modulo
          .map((pm) => pm.modulo.nome_modulo)
          .join(", "),
      }));
      const countProfiles = profiles.length;
      return reply.send({ profilesWithModules, countProfiles });
    } catch (error) {
      console.error("Erro ao buscar perfis:", error);
      return reply.code(500).send({ error: "Erro ao buscar perfis" });
    }
  });
  app.get(
    "/profiles/:profileId",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const getProfileParam = z.object({
        profileId: z.string().refine((val) => !isNaN(Number(val)), {
          message: "profileId must be a number",
        }),
      });

      try {
        const { profileId } = getProfileParam.parse(request.params);
        const id = Number(profileId);
        const profile = await prisma.perfil.findUnique({
          where: {
            id_perfil: id,
          },
        });

        if (!profile) {
          return reply.status(404).send({ error: "Profile not found" });
        }

        return reply.status(200).send(profile);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({ error: error.errors });
        }
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
  app.get(
    "/profiles/report",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      try {
        const profiles = await prisma.perfil.findMany({
          orderBy: {
            id_perfil: "asc",
          },
          include: {
            perfil_modulo: {
              include: {
                modulo: true,
              },
            },
          },
        });

        const wb = new excel.Workbook();
        const ws = wb.addWorksheet("Profiles");

        const headers = ["ID", "Perfil", "Módulo(s)"];
        ws.row(1).freeze();

        headers.forEach((header, index) => {
          ws.cell(1, index + 1).string(header);
        });

        profiles.forEach((profile, rowIndex) => {
          const modules = profile.perfil_modulo
            .map((pm) => pm.modulo.nome_modulo)
            .join(", ");

          ws.cell(rowIndex + 2, 1).number(profile.id_perfil);
          ws.cell(rowIndex + 2, 2).string(profile.nome_perfil);
          ws.cell(rowIndex + 2, 3).string(modules);
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
          `attachment; filename="relatorio_perfis.xlsx"`
        );
        reply.send(buffer);
      } catch (error) {
        console.error("Error generating profiles report:", error);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
