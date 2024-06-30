import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

export async function createProfileModule(app: FastifyInstance) {
  app.post(
    "/profileModule/:profileName",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const updateProfileParam = z.object({
        profileName: z.string(),
      });

      const updateProfileBody = z.object({
        nome_modulo: z.string(),
      });

      try {
        const { profileName } = updateProfileParam.parse(request.params);
        const { nome_modulo } = updateProfileBody.parse(request.body);

        // Verifica se o perfil existe
        const profile = await prisma.perfil.findUnique({
          where: {
            nome_perfil: profileName,
          },
        });

        if (!profile) {
          return reply.code(404).send({ error: "Profile not found" });
        }

        // Verifica se o módulo existe
        const modulo = await prisma.modulo.findUnique({
          where: {
            nome_modulo,
          },
        });

        if (!modulo) {
          return reply.code(404).send({ error: "Module not found" });
        }

        // Cria a associação na tabela perfil_modulo
        await prisma.perfil_modulo.create({
          data: {
            perfil_id: profile.id_perfil,
            modulo_id: modulo.id_modulo,
          },
        });

        return reply.code(200).send({
          message: "Profile-module relationship created successfully",
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

  // Rota para deletar um perfil e suas associações usando nome do perfil
  app.delete(
    "/profileModule/:profileName",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const deleteProfileParam = z.object({
        profileName: z.string(),
      });

      try {
        const { profileName } = deleteProfileParam.parse(request.params);

        // Verifica se o perfil existe
        const profile = await prisma.perfil.findUnique({
          where: {
            nome_perfil: profileName,
          },
        });

        if (!profile) {
          return reply.code(404).send({ error: "Profile not found" });
        }

        // Deleta todas as associações na tabela perfil_modulo
        await prisma.perfil_modulo.deleteMany({
          where: {
            perfil_id: profile.id_perfil,
          },
        });

        // Deleta o perfil
        await prisma.perfil.delete({
          where: {
            id_perfil: profile.id_perfil,
          },
        });

        return reply.code(200).send({
          message: "Profile and its associations deleted successfully",
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
