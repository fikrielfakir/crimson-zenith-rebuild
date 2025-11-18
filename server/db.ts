import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from "../shared/schema.js";

// Create MySQL connection to remote Hostinger database
// Requires MYSQL_DATABASE_URL environment variable with MySQL connection string
const databaseUrl = process.env.MYSQL_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('MYSQL_DATABASE_URL or DATABASE_URL environment variable is required for MySQL connection');
}

const poolConnection = mysql.createPool(databaseUrl);

const db = drizzle(poolConnection, { schema, mode: 'default' });

export { poolConnection as pool, db };
