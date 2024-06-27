import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

export async function getFunctions(app: FastifyInstance) {
  app.get("/functions", { onRequest: [verifyJWT] }, async (request, reply) => {
    const functions = await prisma.funcao.findMany();
    return reply.status(200).send(functions);
  });

  app.get(
    "/functions/:functionId",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const getFunctionParam = z.object({
        functionId: z.string().refine((val) => !isNaN(Number(val)), {
          message: "functionId must be a number",
        }),
      });

      try {
        const { functionId } = getFunctionParam.parse(request.params);
        const id = Number(functionId);
        const functions = await prisma.funcao.findUnique({
          where: {
            id_funcao: id,
          },
        });

        if (!functions) {
          return reply.status(404).send({ error: "Function not found" });
        }

        return reply.status(200).send(functions);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({ error: error.errors });
        }
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
