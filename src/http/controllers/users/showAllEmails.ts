/* eslint-disable no-unused-vars */
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export async function getUsersMail(app: FastifyInstance) {
  app.post("/emails", async (request, reply) => {
    const getEmailBody = z.object({
      email: z.string().email(),
    });

    try {
      const { email } = getEmailBody.parse(request.body);
      const user = await prisma.usuario.findUnique({
        where: {
          email,
        },
      });

      if (user) {
        return reply.status(200).send({ exists: true });
      } else {
        return reply.status(200).send({ exists: false });
      }
    } catch (error) {
      console.error("Error checking email existence:", error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });
}
