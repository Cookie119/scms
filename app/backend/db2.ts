"use server";

import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: "require", // 🔑 REQUIRED for Render
  max: 10,        // connection pool
  idle_timeout: 20,
  connect_timeout: 10,
});

export { sql };
