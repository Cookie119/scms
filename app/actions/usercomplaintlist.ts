"use server";

import { sql } from "@/app/backend/db2";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getUserComplaints() {


    

    const session = await getServerSession(authOptions);

  if (!session?.user?.id) return [];

  const complaints = await sql`
    SELECT *
    FROM complaints
    WHERE user_id = ${session.user.id}
      AND deleted_at IS NULL
    ORDER BY created_at DESC
  `;

  return complaints;
}
