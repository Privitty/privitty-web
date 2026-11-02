import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const QUERY_ENGINE_FILE = "libquery_engine-rhel-openssl-3.0.x.so.node";

/**
 * Amplify packages the Next.js server without the Prisma engine that
 * `prisma generate` wrote into node_modules. Point the client at a copy
 * that the build places inside the deployed output.
 */
function configureQueryEngine() {
  if (process.platform !== "linux" || process.env.PRISMA_QUERY_ENGINE_LIBRARY) return;

  const candidates = [
    path.join(process.cwd(), "node_modules", ".prisma", "client", QUERY_ENGINE_FILE),
    path.join(process.cwd(), ".next", "prisma-engines", QUERY_ENGINE_FILE),
    path.join(process.cwd(), "prisma-engines", QUERY_ENGINE_FILE),
    path.join(process.cwd(), ".next", "node_modules", ".prisma", "client", QUERY_ENGINE_FILE),
  ];

  const enginePath = candidates.find((candidate) => fs.existsSync(candidate));
  if (enginePath) {
    process.env.PRISMA_QUERY_ENGINE_LIBRARY = enginePath;
  }
}

function getDatabaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  if (
    (url.includes("pooler.supabase.com") || url.includes(":6543")) &&
    !url.includes("pgbouncer=true")
  ) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set("pgbouncer", "true");
      return parsed.toString();
    } catch {
      const separator = url.includes("?") ? "&" : "?";
      return `${url}${separator}pgbouncer=true`;
    }
  }
  return url;
}

configureQueryEngine();

const dbUrl = getDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
