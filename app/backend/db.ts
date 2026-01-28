import { Pool } from "pg";


const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "root",
  database: "test2",
  port: 5432,
});

export { pool };


