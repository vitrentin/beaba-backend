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
import { updateUsers } from "./http/controllers/users/update";
import { updateModules } from "./http/controllers/module/update";
import { updateFuctions } from "./http/controllers/function/update";
import { updateTransactions } from "./http/controllers/transaction/update";
import { updateProfiles } from "./http/controllers/profiles/update";
import { searchUsers } from "./http/controllers/users/search";
import { resetPasswordWithToken } from "./http/controllers/users/forgotEmail";
import { createProfileModules } from "./http/controllers/profiles/createRelations";
import { createProfileModule } from "./http/controllers/profiles/createRelationship";
import { createProfile } from "./http/controllers/profiles/crud";
import { createTransaction } from "./http/controllers/transaction/crud";
import { createFunction } from "./http/controllers/function/crud";
import { searchProfiles } from "./http/controllers/profiles/search";
import { searchTransactions } from "./http/controllers/transaction/search";
import { searchFunctions } from "./http/controllers/function/search";
import { searchModules } from "./http/controllers/module/search";

export const app = fastify();

app.register(require("@fastify/cors"), {
  origin: "http://localhost:5173",
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
app.register(updateUsers);
app.register(searchUsers);

app.register(deleteProfiles);
app.register(getProfiles);
app.register(updateProfiles);
app.register(createProfileModules);
app.register(createProfileModule);
app.register(createProfile);
app.register(searchProfiles);

app.register(deleteModules);
app.register(getModules);
app.register(updateModules);
app.register(searchModules);

app.register(deleteTransaction);
app.register(getTransactions);
app.register(updateTransactions);
app.register(createTransaction);
app.register(searchTransactions);

app.register(deleteFunction);
app.register(getFunctions);
app.register(updateFuctions);
app.register(createFunction);
app.register(searchFunctions);

app.register(resetPasswordWithToken);
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
