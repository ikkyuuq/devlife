import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.js";
import { env } from "node:process";

const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

export default db;
