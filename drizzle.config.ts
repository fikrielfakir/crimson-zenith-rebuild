import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.MYSQL_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('MYSQL_DATABASE_URL or DATABASE_URL environment variable is required for MySQL connection');
}

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: databaseUrl,
  },
});
