import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from "../shared/schema.js";

// Create MySQL connection to remote Hostinger database
// Requires DATABASE_URL environment variable with MySQL connection string
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required for MySQL connection');
}

const poolConnection = mysql.createPool(process.env.DATABASE_URL);

const db = drizzle(poolConnection, { schema, mode: 'default' });

export { poolConnection as pool, db };
