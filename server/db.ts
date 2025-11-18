import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "../shared/schema.js";

// Create PostgreSQL connection using Supabase
const connectionString = process.env.SUPABASE_URL 
  ? `postgresql://postgres.${process.env.SUPABASE_URL.split('//')[1].split('.')[0]}:[YOUR-PASSWORD]@${process.env.SUPABASE_URL.split('//')[1]}/postgres`
  : process.env.DATABASE_URL!;

const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

const db = drizzle(client, { schema });

export { client as pool, db };
