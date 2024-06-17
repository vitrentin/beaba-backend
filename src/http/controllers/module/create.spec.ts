import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Create Module (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create Module", async () => {
    const { token } = await createAndAuthenticateUser(app, true);
    const response = await request(app.server)
      .post("/modules")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome_modulo: "te",
        descricao_modulo: "teste",
      });

    expect(response.statusCode).toEqual(201);
  });
});
