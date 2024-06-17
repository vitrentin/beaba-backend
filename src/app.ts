import fastify from "fastify";
import { usersRoutes } from "./http/controllers/users/routes";
import { ZodError } from "zod";
import { env } from "./env";
import fastifyJwt from "@fastify/jwt";
import { modulesRoutes } from "./http/controllers/module/routes";
import { profilesRoutes } from "./http/controllers/profiles/routes";
import { functionsRoutes } from "./http/controllers/function/routes";
import { transactionsRoutes } from "./http/controllers/transaction/routes";
import fastifyCookie from "@fastify/cookie";

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "10m",
  },
});
app.register(fastifyCookie);
app.register(usersRoutes);
app.register(modulesRoutes);
app.register(profilesRoutes);
app.register(functionsRoutes);
app.register(transactionsRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }
  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // TODO: Here e should log to an external tool like DataDog/NewRelic/Sentry
  }
  return reply.status(500).send({ message: "Internal server error." });
});
