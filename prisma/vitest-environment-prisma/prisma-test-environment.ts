/* eslint-disable prettier/prettier */
import { randomInt } from "node:crypto";
import { Environment } from "vitest";
import "dotenv/config";
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

// postgresql://docker:docker@localhost:5436/apisolid?schema=public
// http://localhost:3333/caminho

const prisma = new PrismaClient();

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please povide a DATABASE_URL environment variable.");
  }
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set("scema", schema);

  return url.toString();
}

export default <Environment>(<unknown>{
  name: "prisma",
  transformMode: "ssr",
  async setup() {
    const schema = randomInt(100).toString();
    const databaseURL = generateDatabaseURL(schema);
    process.env.DATABASE_URL = databaseURL;
    execSync("npx prisma migrate deploy");
    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
        );
      },
    };
  },
});
