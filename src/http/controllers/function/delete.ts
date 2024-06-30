import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

export async function deleteFunction(app: FastifyInstance) {
  // Rota para deletar um perfil e suas associações
  app.delete(
    "/functions/:functionId",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const deleteFunctionParam = z.object({
        functionId: z
          .string()
          .transform((val) => parseInt(val, 10))
          .refine((val) => !isNaN(val), {
            message: "functionId must be a valid number",
          }),
      });

      try {
        const { functionId } = deleteFunctionParam.parse(request.params);
        // Verifica se a função existe
        const functions = await prisma.funcao.findUnique({
          where: {
            id_funcao: functionId,
          },
        });

        if (!functions) {
          return reply.code(404).send({ error: "Function not found" });
        }

        // Deleta todas as associações na tabela funcao_modulo
        await prisma.funcao_modulo.deleteMany({
          where: {
            funcao_id: functionId,
          },
        });

        // Deleta a funcao
        await prisma.funcao.delete({
          where: {
            id_funcao: functionId,
          },
        });

        return reply.code(200).send({
          message: "Function and its associations deleted successfully",
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
