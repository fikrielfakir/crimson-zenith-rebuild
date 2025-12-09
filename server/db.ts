import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from "../shared/schema.js";

// MySQL connection to remote Hostinger database
// Credentials should be stored in environment variables
const host = process.env.MYSQL_HOST || 'srv2058.hstgr.io';
const port = parseInt(process.env.MYSQL_PORT || '3306');
const database = process.env.MYSQL_DATABASE || 'u613266227_test';
const user = process.env.MYSQL_USER || 'u613266227_test';
const password = process.env.MYSQL_PASSWORD;

if (!password) {
  throw new Error('MYSQL_PASSWORD must be set in environment variables');
}

// Build connection URL with encoded password to handle special characters
const databaseUrl = `mysql://${user}:${encodeURIComponent(password)}@${host}:${port}/${database}`;

const poolConnection = mysql.createPool(databaseUrl);

const db = drizzle(poolConnection, { schema, mode: 'default' });

export { poolConnection as pool, db };
