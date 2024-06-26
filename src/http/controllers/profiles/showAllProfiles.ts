import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export async function getProfiles(app: FastifyInstance) {
  app.get("/profiles", async (request, reply) => {
    const profiles = await prisma.perfil.findMany();
    return reply.status(200).send(profiles);
  });

  app.get("/profiles/:profileId", async (request, reply) => {
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
  });
}
