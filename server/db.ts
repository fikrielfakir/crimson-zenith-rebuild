import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from "../shared/schema.js";

// Create MySQL connection pool for Hostinger database
const pool = mysql.createPool({
  host: "srv1849.hstgr.io",
  port: 3306,
  user: "u613266227_test",
  password: "#2XnlY6^Dn",
  database: "u613266227_test",
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
});

const db = drizzle(pool, { schema, mode: 'default' });

export { pool, db };
