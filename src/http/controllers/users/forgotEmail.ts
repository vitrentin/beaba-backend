import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import jwt from "jsonwebtoken";

export async function resetPasswordWithToken(app: FastifyInstance) {
  app.put("/reset-password", async (request, reply) => {
    const bodySchema = z.object({
      email: z.string().email(),
      senha: z.string().min(6),
      confirmarSenha: z.string().min(6),
      token: z.string(),
    });

    try {
      const { email, senha, confirmarSenha, token } = bodySchema.parse(
        request.body
      );

      if (senha !== confirmarSenha) {
        return reply.code(400).send({ error: "As senhas não coincidem" });
      }

      const isTokenValid = await verifyToken(token, email);
      if (!isTokenValid) {
        return reply.code(400).send({ error: "Token inválido ou expirado" });
      }

      const user = await prisma.usuario.findUnique({
        where: { email },
      });

      if (!user) {
        return reply.code(404).send({ error: "Usuário não encontrado" });
      }

      const senha_hash = await hash(senha, 3);

      await prisma.usuario.update({
        where: { email },
        data: { senha_hash },
      });

      return reply.code(200).send({ message: "Senha atualizada com sucesso" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: error.errors });
      }
      console.error("Internal Server Error:", error);
      return reply.code(500).send({ error: "Internal Server Error" });
    }
  });
}

// Função para verificar se o token JWT é válido
async function verifyToken(token: string, email: string): Promise<boolean> {
  const SECRET_KEY = "beabaaleatorio"; // Defina sua chave secreta aqui

  try {
    const payload = jwt.verify(token, SECRET_KEY) as { email: string };
    return payload.email === email;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log("Token expirado:", error.message);
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.log("Token inválido:", error.message);
    }
    return false;
  }
}
