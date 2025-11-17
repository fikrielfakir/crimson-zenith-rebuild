import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    host: process.env.DB_HOST || "srv1849.hstgr.io",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "u613266227_test",
    password: process.env.DB_PASSWORD || "#2XnlY6^Dn",
    database: process.env.DB_NAME || "u613266227_test",
  },
});