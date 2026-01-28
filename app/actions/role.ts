"use server";

import { sql } from "@/app/backend/db2";

/* =========================
   CREATE
========================= */
export async function addRole(formData: FormData): Promise<void> {
  const role_name = formData.get("role_name") as string;

  if (!role_name) throw new Error("Role name required");

  await sql`
    INSERT INTO roles (role_name)
    VALUES (${role_name})
  `;
}

/* =========================
   READ (ONLY ACTIVE)
========================= */
export async function getRoles() {
  return await sql`
    SELECT role_id, role_name
    FROM roles
    WHERE deleted_at IS NULL
    ORDER BY role_id
  `;
}

/* =========================
   UPDATE
========================= */
export async function updateRole(formData: FormData): Promise<void> {
  const role_id = Number(formData.get("role_id"));
  const role_name = formData.get("role_name") as string;

  await sql`
    UPDATE roles
    SET role_name = ${role_name}
    WHERE role_id = ${role_id}
      AND deleted_at IS NULL
  `;
}

/* =========================
   SOFT DELETE
========================= */
export async function deleteRole(formData: FormData): Promise<void> {
  const role_id = Number(formData.get("role_id"));

  await sql`
    UPDATE roles
    SET deleted_at = NOW()
    WHERE role_id = ${role_id}
  `;
}

/* =========================
   SOFT DELETE RESTORE
========================= */

export async function restoreRole(formData: FormData): Promise<void> {
  const role_id = Number(formData.get("role_id"));

  await sql`
    UPDATE roles
    SET deleted_at = NULL
    WHERE role_id = ${role_id}
  `;
}
