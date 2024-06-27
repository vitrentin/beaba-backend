import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

type UpdateFunctionInput = {
  nome_funcao?: string;
  descricao_funcao?: string;
  modulo_associado?: string;
};

export async function updateFuctions(app: FastifyInstance) {
  app.put(
    "/functions/:functionId",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const updateFunctionParam = z.object({
        functionId: z
          .string()
          .transform((val) => parseInt(val, 10))
          .refine((val) => !isNaN(val), {
            message: "functionId must be a valid number",
          }),
      });

      const updateFunctionBody = z.object({
        nome_funcao: z.string().optional(),
        descricao_funcao: z.string().optional(),
        modulo_associado: z.string().optional(),
      });

      try {
        const { functionId } = updateFunctionParam.parse(request.params);
        const functionData: UpdateFunctionInput = updateFunctionBody.parse(
          request.body
        );

        if (functionData.nome_funcao) {
          const functionExists = await prisma.funcao.findUnique({
            where: {
              nome_funcao: functionData.nome_funcao,
            },
          });

          if (functionExists) {
            return reply.code(400).send({ error: "Function already in use" });
          }
        }

        const functions = await prisma.funcao.findUnique({
          where: {
            id_funcao: functionId,
          },
        });

        if (!functions) {
          return reply.code(404).send({ error: "Function not found" });
        }

        const dataToUpdate: any = {
          nome_funcao: functionData.nome_funcao,
          descricao_funcao: functionData.descricao_funcao,
          modulo_associado: functionData.modulo_associado,
        };

        await prisma.funcao.update({
          where: {
            id_funcao: functionId,
          },
          data: dataToUpdate,
        });

        return reply
          .code(200)
          .send({ message: "Function updated successfully" });
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
