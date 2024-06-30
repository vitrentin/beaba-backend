import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

export async function deleteProfiles(app: FastifyInstance) {
  // Rota para deletar um perfil e suas associações
  app.delete(
    "/profiles/:profileId",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const deleteProfileParam = z.object({
        profileId: z
          .string()
          .transform((val) => parseInt(val, 10))
          .refine((val) => !isNaN(val), {
            message: "profileId must be a valid number",
          }),
      });

      try {
        const { profileId } = deleteProfileParam.parse(request.params);
        // Verifica se o perfil existe
        const profile = await prisma.perfil.findUnique({
          where: {
            id_perfil: profileId,
          },
        });

        if (!profile) {
          return reply.code(404).send({ error: "Profile not found" });
        }

        // Deleta todas as associações na tabela perfil_modulo
        await prisma.perfil_modulo.deleteMany({
          where: {
            perfil_id: profileId,
          },
        });

        // Deleta o perfil
        await prisma.perfil.delete({
          where: {
            id_perfil: profileId,
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
