"use server";

import {sql} from "@/app/backend/db2";
import {pool} from "@/app/backend/db"
// CREATE - Add new category

// export async function addCategory(formData: FormData) {
//   const category_name = formData.get("category_name") as string;
//   const handler_role_id = Number(formData.get("handler_role_id"));
  
//   const [category] = await sql`
//     INSERT INTO categories (category_name, handler_role_id) 
//     VALUES (${category_name}, ${handler_role_id})
//     RETURNING category_id, category_name, handler_role_id
//   `;
  
//   return category;
// }


export async function addCategory(formData: FormData): Promise<void> {
  const category_name = formData.get("category_name") as string;
  const handler_role_id = Number(formData.get("handler_role_id"));

  await pool.query(
    `INSERT INTO categories (category_name, handler_role_id)
     VALUES ($1, $2)`,
    [category_name, handler_role_id]
  );
}

// READ - Get all active categories
export async function getCategories() {
  const categories = await sql`
    SELECT 
      c.category_id,
      c.category_name,
      c.handler_role_id,
      r.role_name
    FROM categories c
    LEFT JOIN roles r ON c.handler_role_id = r.role_id
    WHERE c.deleted_at IS NULL
    ORDER BY c.category_name
  `;
  
  return categories;
}

// UPDATE - Edit category
export async function updateCategory(formData: FormData) {
  const category_id = Number(formData.get("category_id"));
  const category_name = formData.get("category_name") as string;
  const handler_role_id = Number(formData.get("handler_role_id"));
  
  await sql`
    UPDATE categories 
    SET category_name = ${category_name}, handler_role_id = ${handler_role_id}
    WHERE category_id = ${category_id}
  `;
  
  return { success: true };
}

// DELETE - Soft delete category
export async function deleteCategory(category_id: number) {
  await sql`
    UPDATE categories 
    SET deleted_at = NOW()
    WHERE category_id = ${category_id}
  `;
  
  return { success: true };
}

// READ - Get single category (for edit)
export async function getCategory(category_id: number) {
  const [category] = await sql`
    SELECT * FROM categories WHERE category_id = ${category_id}
  `;
  
  return category;
}

// READ - Get roles for dropdown
export async function getRoles() {
  const roles = await sql`SELECT role_id, role_name FROM roles`;
  return roles;
}