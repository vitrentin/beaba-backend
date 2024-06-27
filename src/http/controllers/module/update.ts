import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

type UpdateModuleInput = {
  nome_modulo?: string;
  descricao_modulo?: string;
};

export async function updateModules(app: FastifyInstance) {
  app.put(
    "/modules/:moduleId",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const updateModuleParam = z.object({
        moduleId: z
          .string()
          .transform((val) => parseInt(val, 10))
          .refine((val) => !isNaN(val), {
            message: "moduleId must be a valid number",
          }),
      });

      const updateModuleBody = z.object({
        nome_modulo: z.string().optional(),
        descricao_modulo: z.string().optional(),
      });

      try {
        const { moduleId } = updateModuleParam.parse(request.params);
        const moduleData: UpdateModuleInput = updateModuleBody.parse(
          request.body
        );

        if (moduleData.nome_modulo) {
          const moduleExists = await prisma.modulo.findUnique({
            where: {
              nome_modulo: moduleData.nome_modulo,
            },
          });

          if (moduleExists) {
            return reply.code(400).send({ error: "Module already in use" });
          }
        }

        const module = await prisma.modulo.findUnique({
          where: {
            id_modulo: moduleId,
          },
        });

        if (!module) {
          return reply.code(404).send({ error: "Module not found" });
        }

        const dataToUpdate: any = {
          nome_modulo: moduleData.nome_modulo,
          descricao_modulo: moduleData.descricao_modulo,
        };

        await prisma.modulo.update({
          where: {
            id_modulo: moduleId,
          },
          data: dataToUpdate,
        });

        return reply.code(200).send({ message: "Module updated successfully" });
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
