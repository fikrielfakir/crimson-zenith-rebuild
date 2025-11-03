import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from "../shared/schema.js";

// Create MySQL connection pool using environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST || "srv1849.hstgr.io",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "u613266227_test",
  password: process.env.DB_PASSWORD || "#2XnlY6^Dn",
  database: process.env.DB_NAME || "u613266227_test",
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
});

const db = drizzle(pool, { schema, mode: 'default' });

export { pool, db };
