import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { search } from "./search";
import { create } from "./create";

export async function modulesRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/modules/search", { onRequest: [verifyJWT] }, search);
  app.post("/modules", { onRequest: [verifyJWT] }, create);
  // app.post("/profiles/:profilesId/modules", create);
}
