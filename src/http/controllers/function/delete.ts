import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

export async function deleteFunction(app: FastifyInstance) {
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
        const functions = await prisma.funcao.findUnique({
          where: {
            id_funcao: functionId,
          },
        });

        if (!functions) {
          return reply.code(404).send({ error: "Function not found" });
        }

        await prisma.funcao.delete({
          where: {
            id_funcao: functionId,
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
