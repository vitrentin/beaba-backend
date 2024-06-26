import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "./authenticate";
import { profile } from "./profile";
import { verifyJWT } from "../../middlewares/verify-jwt";
// import { refresh } from "./refresh";
// import { verifyUserProfile } from "@/http/middlewares/verify-user-profile";

export async function usersRoutes(app: FastifyInstance) {
  // authenticated
  app.post("/sessions", authenticate);

  // Posts
  app.post("/users", register); // { onRequest: [verifyUserProfile(1)] },

  // app.patch("/token/refresh", refresh);

  // Gets
  app.get("/me", { onRequest: [verifyJWT] }, profile);
}
