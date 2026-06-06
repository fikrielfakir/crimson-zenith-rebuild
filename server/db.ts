import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from "../shared/schema.js";

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set in environment variables');
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

export { pool, db };
