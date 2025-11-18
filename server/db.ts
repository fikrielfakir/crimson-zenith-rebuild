import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from "../shared/schema.js";

// Create PostgreSQL connection pool using the DATABASE_URL from Replit
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!
});

const db = drizzle(pool, { schema });

export { pool, db };
