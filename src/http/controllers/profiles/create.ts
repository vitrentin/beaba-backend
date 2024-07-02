import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

export async function createProfile(app: FastifyInstance) {
  app.post("/profile", { onRequest: [verifyJWT] }, async (request, reply) => {
    const createProfileBody = z.object({
      nome_perfil: z.string(),
      nome_modulo: z.string().optional(),
    });

    try {
      const profileData = createProfileBody.parse(request.body);

      // Verificar se o perfil já existe somente se nome_modulo não estiver definido
      let profile = await prisma.perfil.findUnique({
        where: { nome_perfil: profileData.nome_perfil },
      });

      if (!profile) {
        profile = await prisma.perfil.create({
          data: { nome_perfil: profileData.nome_perfil },
        });
      } else if (!isDefined(profileData.nome_modulo)) {
        return reply.code(400).send({ error: "Perfil já existe" });
      }

      if (isDefined(profileData.nome_modulo)) {
        // Verificar se o módulo existe
        const module = await prisma.modulo.findUnique({
          where: { nome_modulo: profileData.nome_modulo },
        });

        if (!module) {
          return reply.code(400).send({ error: "Módulo não encontrado" });
        }

        // Verificar se a associação já existe
        const existingAssociation = await prisma.perfil_modulo.findFirst({
          where: {
            perfil_id: profile.id_perfil,
            modulo_id: module.id_modulo,
          },
        });

        if (existingAssociation) {
          return reply
            .code(400)
            .send({ error: "Perfil e módulo já associados" });
        }

        // Criar a associação
        await prisma.perfil_modulo.create({
          data: {
            perfil_id: profile.id_perfil,
            modulo_id: module.id_modulo,
          },
        });
      }

      return reply
        .code(201)
        .send({ message: "Perfil criado e/ou associado com sucesso" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: error.errors });
      }
      console.error("Internal Server Error:", error);
      return reply.code(500).send({ error: "Internal Server Error" });
    }
  });
}

// Guarda de tipo para garantir que um valor não seja undefined
function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}
