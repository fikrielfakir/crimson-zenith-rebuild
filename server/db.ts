import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { Pool as PgPool } from 'pg';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import ws from "ws";
import * as schema from "../shared/schema.js";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Conditional driver selection based on database URL
const url = new URL(process.env.DATABASE_URL);
const isNeon = /\.neon\.tech$/i.test(url.hostname);

let pool: NeonPool | PgPool;
let db: ReturnType<typeof drizzleNeon> | ReturnType<typeof drizzlePg>;

if (isNeon) {
  // Use Neon serverless driver for production Neon databases
  neonConfig.webSocketConstructor = ws;
  pool = new NeonPool({ connectionString: process.env.DATABASE_URL });
  db = drizzleNeon(pool, { schema });
} else {
  // Use standard PostgreSQL driver for local development
  pool = new PgPool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: false  // Explicitly disable SSL for local development
  });
  db = drizzlePg(pool, { schema });
}

export { pool, db };
