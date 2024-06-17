import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
// import { prisma } from "@/lib/prisma";

describe("Create Profiles (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a profile", async () => {
    const { token } = await createAndAuthenticateUser(app);

    // const module = await prisma.modulo.create({
    //   data: {
    //     nome_modulo: "modulo",
    //   },
    // });
    const response = await request(app.server)
      .post(`/profiles`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome_perfil: "teste",
      });
    // const response = await request(app.server)
    //   .post(`/profiles/${module.id_modulo}/modules`)
    //   .set("Authorization", `Bearer ${token}`)
    //   .send({
    //     nome_perfil: "teste",
    //   });

    expect(response.statusCode).toEqual(201);
  });
});
