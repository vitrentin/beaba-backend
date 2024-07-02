import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { create } from "./solid";

export async function profilesRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post("/profiles", { onRequest: [verifyJWT] }, create);
}
