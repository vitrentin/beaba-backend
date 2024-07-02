import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { create } from "./solid";

export async function functionsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post("/functions", { onRequest: [verifyJWT] }, create);
}
