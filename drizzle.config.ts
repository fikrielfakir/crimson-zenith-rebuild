import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: 'postgresql://postgres.uktcwapwgvkazlmajnhf:thejourny@aws-1-eu-west-1.pooler.supabase.com:6543/postgres',
  },
});
