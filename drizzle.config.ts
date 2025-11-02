import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    host: "srv1849.hstgr.io",
    port: 3306,
    user: "u613266227_test",
    password: "#2XnlY6^Dn",
    database: "u613266227_test",
  },
});