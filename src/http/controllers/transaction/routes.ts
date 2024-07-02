import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { create } from "./solid";

export async function transactionsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post("/transactions", { onRequest: [verifyJWT] }, create);
}
