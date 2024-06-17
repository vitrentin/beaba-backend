/* eslint-disable prettier/prettier */
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmn = false
) {
  await prisma.usuario.create({
    data: {
      nome_usuario: "John Doe",
      email: "johndoe@example.com",
      senha_hash: await hash("123456", 3),
      perfil_id: isAdmn ? 1 : 2,
    },
  });

  const authResponse = await request(app.server).post("/sessions").send({
    email: "johndoe@example.com",
    password: "123456",
  });

  const { token } = authResponse.body;

  return {
    token,
  };
}
