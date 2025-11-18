import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from "../shared/schema.js";

// Create PostgreSQL connection pool using Replit database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 10,
});

const db = drizzle(pool, { schema });

export { pool, db };
