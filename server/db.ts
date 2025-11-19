import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from "../shared/schema.js";

// Permanent MySQL connection to remote Hostinger database
// Credentials are hardcoded to work across different Replit accounts
const host = process.env.MYSQL_HOST || 'srv2058.hstgr.io';
const port = parseInt(process.env.MYSQL_PORT || '3306');
const database = process.env.MYSQL_DATABASE || 'u613266227_test';
const user = process.env.MYSQL_USER || 'u613266227_test';
const password = process.env.MYSQL_PASSWORD || 'u?9fV8A&UA';

// Build connection URL with encoded password to handle special characters
const databaseUrl = `mysql://${user}:${encodeURIComponent(password)}@${host}:${port}/${database}`;

const poolConnection = mysql.createPool(databaseUrl);

const db = drizzle(poolConnection, { schema, mode: 'default' });

export { poolConnection as pool, db };
