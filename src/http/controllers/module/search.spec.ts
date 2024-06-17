import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Search Modules (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to search modules by name", async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server)
      .post("/modules")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome_modulo: "te",
        descricao_modulo: "teste",
      });

    await request(app.server)
      .post("/modules")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "teste",
      });

    const response = await request(app.server)
      .get("/modules/search")
      .query({
        query: "teste",
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.modules).toHaveLength(1);
    expect(response.body.modules).toEqual([
      expect.objectContaining({
        nome_modulo: "teste",
      }),
    ]);
  });
});
