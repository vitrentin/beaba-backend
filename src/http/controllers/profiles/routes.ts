import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { search } from "./search";
import { create } from "./create";

export async function profilesRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/profiles/search", search);
  app.post("/profiles", create);
}
