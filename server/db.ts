import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "../shared/schema.js";

// Create PostgreSQL connection using Supabase
// Use transaction pooler mode (disable prepared statements)
// Requires DATABASE_URL environment variable with Supabase pooler connection
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required for Supabase connection');
}

const client = postgres(process.env.DATABASE_URL, {
  prepare: false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

const db = drizzle(client, { schema });

export { client as pool, db };
