import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

export async function deleteProfiles(app: FastifyInstance) {
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
        const profile = await prisma.perfil.findUnique({
          where: {
            id_perfil: profileId,
          },
        });

        if (!profile) {
          return reply.code(404).send({ error: "Profile not found" });
        }

        await prisma.perfil.delete({
          where: {
            id_perfil: profileId,
          },
        });

        return reply.code(204).send();
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({ error: error.errors });
        }
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
