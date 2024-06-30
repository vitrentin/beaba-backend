import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

export async function createFunction(app: FastifyInstance) {
  app.post("/function", { onRequest: [verifyJWT] }, async (request, reply) => {
    const createFunctionBody = z.object({
      nome_funcao: z.string(),
      descricao_funcao: z.string().optional(),
      nome_modulo: z.string().optional(),
    });

    try {
      const functionData = createFunctionBody.parse(request.body);

      // Verificar se a transação já existe
      const existingFunction = await prisma.funcao.findUnique({
        where: { nome_funcao: functionData.nome_funcao },
      });

      let functions;
      if (existingFunction) {
        functions = existingFunction;
      } else {
        functions = await prisma.funcao.create({
          data: {
            nome_funcao: functionData.nome_funcao,
            descricao_funcao: functionData.descricao_funcao,
          },
        });
      }

      if (isDefined(functionData.nome_modulo)) {
        // Verificar se o módulo existe
        const module = await prisma.modulo.findUnique({
          where: { nome_modulo: functionData.nome_modulo },
        });

        if (!module) {
          return reply.code(400).send({ error: "Módulo não encontrado" });
        }

        // Verificar se a associação já existe
        const existingAssociation = await prisma.funcao_modulo.findFirst({
          where: {
            funcao_id: functions.id_funcao,
            modulo_id: module.id_modulo,
          },
        });

        if (existingAssociation) {
          return reply
            .code(400)
            .send({ error: "Função e módulo já associados" });
        }

        // Criar a associação
        await prisma.funcao_modulo.create({
          data: {
            funcao_id: functions.id_funcao,
            modulo_id: module.id_modulo,
          },
        });
      }

      return reply
        .code(201)
        .send({ message: "Função criada e/ou associada com sucesso" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: error.errors });
      }
      console.error("Internal Server Error:", error);
      return reply.code(500).send({ error: "Internal Server Error" });
    }
  });
}

// Guarda de tipo para garantir que um valor não seja undefined
function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}
