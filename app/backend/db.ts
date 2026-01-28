// import { Pool } from "pg";


// const pool = new Pool({
//   host: "localhost",
//   user: "postgres",
//   password: "root",
//   database: "test2",
//   port: 5432,
// });

// export { pool };


import { Pool } from "pg";

const globalForPg = global as unknown as {
  pgPool?: Pool;
};

export const pool =
  globalForPg.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // REQUIRED for Render
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.pgPool = pool;
}
