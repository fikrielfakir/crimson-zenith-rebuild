import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "../shared/schema.js";

// Create PostgreSQL connection
// Requires DATABASE_URL environment variable with PostgreSQL connection string
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required for PostgreSQL connection');
}

const client = postgres(process.env.DATABASE_URL);

const db = drizzle(client, { schema });

export { client as pool, db };
