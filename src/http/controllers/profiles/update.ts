import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

type UpdateProfileInput = {
  nome_perfil?: string;
};

export async function updateProfiles(app: FastifyInstance) {
  app.put(
    "/profiles/:profileId",
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
        nome_perfil: z.string().optional(),
      });

      try {
        const { profileId } = updateProfileParam.parse(request.params);
        const profileData: UpdateProfileInput = updateProfileBody.parse(
          request.body
        );

        if (profileData.nome_perfil) {
          const profileExists = await prisma.perfil.findUnique({
            where: {
              nome_perfil: profileData.nome_perfil,
            },
          });

          if (profileExists) {
            return reply.code(400).send({ error: "Profile already in use" });
          }
        }

        const profiles = await prisma.perfil.findUnique({
          where: {
            id_perfil: profileId,
          },
        });

        if (!profiles) {
          return reply.code(404).send({ error: "Profile not found" });
        }

        const dataToUpdate: any = {
          nome_perfil: profileData.nome_perfil,
        };

        await prisma.perfil.update({
          where: {
            id_perfil: profileId,
          },
          data: dataToUpdate,
        });

        return reply
          .code(200)
          .send({ message: "Profile updated successfully" });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({ error: error.errors });
        }
        console.error("Internal Server Error:", error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    }
  );

  app.delete(
    "/profiles/:profileId/modules/:moduleId",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const deleteModuleParam = z.object({
        profileId: z
          .string()
          .transform((val) => parseInt(val, 10))
          .refine((val) => !isNaN(val), {
            message: "profileId must be a valid number",
          }),
        moduleId: z
          .string()
          .transform((val) => parseInt(val, 10))
          .refine((val) => !isNaN(val), {
            message: "moduleId must be a valid number",
          }),
      });

      try {
        const { profileId, moduleId } = deleteModuleParam.parse(request.params);

        await prisma.perfil_modulo.deleteMany({
          where: {
            perfil_id: profileId,
            modulo_id: moduleId,
          },
        });

        return reply
          .code(200)
          .send({ message: "Module removed from profile successfully" });
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
