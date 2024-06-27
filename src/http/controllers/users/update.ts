import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { hash } from "bcryptjs";

type UpdateUserInput = {
  nome_usuario?: string;
  email?: string;
  senha?: string;
};

export async function updateUsers(app: FastifyInstance) {
  app.put(
    "/users/:userId",
    { onRequest: [verifyJWT] },
    async (request, reply) => {
      const updateUserParam = z.object({
        userId: z
          .string()
          .transform((val) => parseInt(val, 10))
          .refine((val) => !isNaN(val), {
            message: "userId must be a valid number",
          }),
      });

      const updateUserBody = z.object({
        nome_usuario: z.string().optional(),
        email: z.string().email().optional(),
        senha: z.string().optional(),
      });

      try {
        const { userId } = updateUserParam.parse(request.params);
        const userData: UpdateUserInput = updateUserBody.parse(request.body);

        if (userData.email) {
          const emailExists = await prisma.usuario.findUnique({
            where: {
              email: userData.email,
            },
          });

          if (emailExists && emailExists.id_usuario !== userId) {
            return reply.code(400).send({ error: "Email already in use" });
          }
        }

        const user = await prisma.usuario.findUnique({
          where: {
            id_usuario: userId,
          },
        });

        if (!user) {
          return reply.code(404).send({ error: "User not found" });
        }

        const dataToUpdate: any = {
          nome_usuario: userData.nome_usuario,
          email: userData.email,
        };

        if (userData.senha) {
          const senha_hash = await hash(userData.senha, 3);
          dataToUpdate.senha_hash = senha_hash;
        }

        await prisma.usuario.update({
          where: {
            id_usuario: userId,
          },
          data: dataToUpdate,
        });

        return reply.code(200).send({ message: "User updated successfully" });
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
