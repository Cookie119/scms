"use server";

import postgres from "postgres";

const sql = postgres({
    host: "localhost",
  user: "postgres",
  password: "root",
  database: "test2",
  port: 5432,

})

export {sql}


