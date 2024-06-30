import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { create } from "./create";

export async function profilesRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post("/profiles", { onRequest: [verifyJWT] }, create);
}
