import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { search } from "./search";
import { create } from "./create";

export async function profilesRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/profiles/search", { onRequest: [verifyJWT] }, search);
  app.post("/profiles", { onRequest: [verifyJWT] }, create);
}
