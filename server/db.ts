import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "../shared/schema.js";

// Create PostgreSQL connection using Supabase
// Use transaction pooler mode (disable prepared statements)
// Prioritize the correct pooler connection string
const connectionString = process.env.DATABASE_URL?.includes('pooler.supabase.com:6543')
  ? process.env.DATABASE_URL
  : 'postgresql://postgres.uktcwapwgvkazlmajnhf:thejourny@aws-1-eu-west-1.pooler.supabase.com:6543/postgres';

const client = postgres(connectionString, {
  prepare: false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

const db = drizzle(client, { schema });

export { client as pool, db };
