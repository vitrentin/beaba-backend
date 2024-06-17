import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { search } from "./search";
import { create } from "./create";

export async function transactionsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/transactions/search", search);
  app.post("/transactions", create);
  // app.post("/profiles/:profilesId/transactions", create);
  // app.post("/modules/:modulesId/transactions", create);
}
