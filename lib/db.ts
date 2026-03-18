import { PrismaClient } from "@prisma/client";

// Serverless + pgBouncer: create a new client per invocation in production
// to avoid prepared statement conflicts (error 42P05)
// In development: reuse via globalThis to avoid hot-reload overhead

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error"] : [],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// In serverless (production), always create fresh client to avoid pgBouncer
// prepared statement conflicts. In dev, reuse to avoid hot-reload exhaustion.
export const db =
  process.env.NODE_ENV === "production"
    ? createPrismaClient()
    : (globalForPrisma.prisma ?? (globalForPrisma.prisma = createPrismaClient()));
