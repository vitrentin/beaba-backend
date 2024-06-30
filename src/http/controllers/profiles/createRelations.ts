import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

export async function createProfileModules(app: FastifyInstance) {
  app.post(
    "/profileModules/:profileId",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const updateProfileParam = z.object({
        profileId: z
          .string()
          .transform((val) => parseInt(val, 10))
          .refine((val) => !isNaN(val), {
            message: "profileId must be a valid number",
          }),
      });

      const updateProfileBody = z.object({
        nome_modulo: z.string(),
      });

      try {
        const { profileId } = updateProfileParam.parse(request.params);
        const { nome_modulo } = updateProfileBody.parse(request.body);

        // Verifica se o perfil existe
        const profile = await prisma.perfil.findUnique({
          where: {
            id_perfil: profileId,
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
            perfil_id: profileId,
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
}
