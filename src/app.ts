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
import { getUsers } from "./http/controllers/users/showAllUsers";
import { deleteUsers } from "./http/controllers/users/delete";
import { deleteModules } from "./http/controllers/module/delete";
import { getModules } from "./http/controllers/module/showAllModules";
import { deleteProfiles } from "./http/controllers/profiles/delete";
import { getProfiles } from "./http/controllers/profiles/showAllProfiles";
import { deleteTransaction } from "./http/controllers/transaction/delete";
import { getTransactions } from "./http/controllers/transaction/showAllTransactions";
import { deleteFunction } from "./http/controllers/function/delete";
import { getFunctions } from "./http/controllers/function/showAllFunction";

export const app = fastify();

app.register(require("@fastify/cors"), {
  origin: "*",
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Accept",
    "Content-Type",
    "Authorization",
  ],
  methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "1d",
  },
});

app.register(deleteUsers);
app.register(getUsers);

app.register(deleteProfiles);
app.register(getProfiles);

app.register(deleteModules);
app.register(getModules);

app.register(deleteTransaction);
app.register(getTransactions);

app.register(deleteFunction);
app.register(getFunctions);

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
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: "Internal server error." });
});
