"use server";

import { pool } from "@/app/backend/db";

export async function getCategories() {
  const res = await pool.query(`
    SELECT category_id, category_name
    FROM categories
    ORDER BY category_name
  `);

  return res.rows;
}

export async function addcomplaints(){
await pool.query(`insert into category ()`)
}
