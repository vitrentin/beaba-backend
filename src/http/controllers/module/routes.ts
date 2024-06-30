import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { create } from "./create";

export async function modulesRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post("/modules", { onRequest: [verifyJWT] }, create);
}
