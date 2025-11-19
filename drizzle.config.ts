import { defineConfig } from "drizzle-kit";

// Permanent MySQL connection configuration
// Credentials are hardcoded to work across different Replit accounts
const host = process.env.MYSQL_HOST || 'srv2058.hstgr.io';
const port = parseInt(process.env.MYSQL_PORT || '3306');
const database = process.env.MYSQL_DATABASE || 'u613266227_test';
const user = process.env.MYSQL_USER || 'u613266227_test';
const password = process.env.MYSQL_PASSWORD || 'u?9fV8A&UA';

const databaseUrl = `mysql://${user}:${encodeURIComponent(password)}@${host}:${port}/${database}`;

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: databaseUrl,
  },
});
