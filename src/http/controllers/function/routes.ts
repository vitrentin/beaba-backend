import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { search } from "./search";
import { create } from "./create";

export async function functionsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/functions/search", { onRequest: [verifyJWT] }, search);
  app.post("/functions", { onRequest: [verifyJWT] }, create);
  // app.post("/profiles/:profilesId/functions", create);
  // app.post("/modules/:modulesId/functions", create);
}
