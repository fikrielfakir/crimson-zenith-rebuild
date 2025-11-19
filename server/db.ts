import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from "../shared/schema.js";

// Create MySQL connection to remote Hostinger database
// Uses individual MYSQL_* environment variables
const host = process.env.MYSQL_HOST;
const port = parseInt(process.env.MYSQL_PORT || '3306');
const database = process.env.MYSQL_DATABASE;
const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;

if (!host || !database || !user || !password) {
  throw new Error('MYSQL_HOST, MYSQL_DATABASE, MYSQL_USER, and MYSQL_PASSWORD environment variables are required');
}

// Build connection URL
const databaseUrl = `mysql://${user}:${encodeURIComponent(password)}@${host}:${port}/${database}`;

const poolConnection = mysql.createPool(databaseUrl);

const db = drizzle(poolConnection, { schema, mode: 'default' });

export { poolConnection as pool, db };
