import "dotenv/config";
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Create apps/backend/.env from .env.example");
}

const adapter = new PrismaPg({ connectionString });

export interface Context {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never>;
}

export const prisma = new PrismaClient({
  adapter,
});
