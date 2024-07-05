import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = "beabaaleatorio";

export async function resetPassword(app: FastifyInstance) {
  app.post("/reset-password", async (request, reply) => {
    const resetPasswordBody = z.object({
      token: z.string(),
      email: z.string().email(),
      novaSenha: z.string().min(6),
    });

    try {
      const { token, email, novaSenha } = resetPasswordBody.parse(request.body);

      let decodedToken: JwtPayload;
      try {
        decodedToken = jwt.verify(token, SECRET_KEY) as JwtPayload;
      } catch (error) {
        return reply.code(400).send({ error: "Invalid or expired token" });
      }

      if (decodedToken.email !== email) {
        return reply
          .code(400)
          .send({ error: "Invalid token for the provided email" });
      }

      const senha_hash = await hash(novaSenha, 3);

      const user = await prisma.usuario.update({
        where: { email },
        data: { senha_hash },
      });

      if (!user) {
        return reply.code(404).send({ error: "User not found" });
      }

      return reply.code(200).send({ message: "Password updated successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: error.errors });
      }
      console.error("Internal Server Error:", error);
      return reply.code(500).send({ error: "Internal Server Error" });
    }
  });
}
