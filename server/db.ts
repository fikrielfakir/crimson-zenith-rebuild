import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "../shared/schema.js";

// Create PostgreSQL connection to Replit database
// Uses DATABASE_URL environment variable with PostgreSQL connection string
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required for PostgreSQL connection');
}

const poolConnection = postgres(databaseUrl);

const db = drizzle(poolConnection, { schema });

export { poolConnection as pool, db };
