import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Use connection pooling with proper limits for serverless
const connectionString = process.env.DATABASE_URL;

// Singleton pattern for connection pool
let pool: Pool | undefined;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString,
      max: 1, // Limit to 1 connection per serverless function
      idleTimeoutMillis: 10000, // Close idle connections after 10s
      connectionTimeoutMillis: 5000, // Timeout after 5s
    });

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected pool error', err);
    });
  }
  return pool;
}

const adapter = new PrismaPg(getPool());

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    // Add connection pool settings
  
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
if (typeof window === 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
    await pool?.end();
  });
}