import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "../../middlewares/verify-jwt";

export async function searchProfiles(app: FastifyInstance) {
  app.post(
    "/search/profiles",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const searchProfileBody = z.object({
        nome_perfil: z.string().optional(),
      });

      try {
        const { nome_perfil } = searchProfileBody.parse(request.body);

        const profiles = await prisma.perfil.findMany({
          where: {
            nome_perfil: {
              contains: nome_perfil,
              mode: "insensitive",
            },
          },
          include: {
            perfil_modulo: {
              include: {
                modulo: true,
              },
            },
          },
        });

        return reply.status(200).send(profiles);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({ error: error.errors });
        }
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
