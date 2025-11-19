import { defineConfig } from "drizzle-kit";

const host = process.env.MYSQL_HOST;
const port = parseInt(process.env.MYSQL_PORT || '3306');
const database = process.env.MYSQL_DATABASE;
const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;

if (!host || !database || !user || !password) {
  throw new Error('MYSQL_HOST, MYSQL_DATABASE, MYSQL_USER, and MYSQL_PASSWORD environment variables are required');
}

const databaseUrl = `mysql://${user}:${encodeURIComponent(password)}@${host}:${port}/${database}`;

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: databaseUrl,
  },
});
