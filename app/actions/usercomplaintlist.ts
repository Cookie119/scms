//   // "use server";

//   // import { sql } from "@/app/backend/db2";
//   // import { getServerSession } from "next-auth";
//   // import { authOptions } from "@/app/api/auth/[...nextauth]/route";

//   // export async function getUserComplaints() {

//   //     const session = await getServerSession(authOptions);

//   //   if (!session?.user?.id) return [];

//   //   const complaints = await sql`
//   //     SELECT *
//   //     FROM complaints
//   //     WHERE user_id = ${session.user.id}
//   //       AND deleted_at IS NULL
//   //     ORDER BY created_at DESC
//   //   `;

//   //   return complaints;
//   // }


// "use server";

// import { sql } from "@/app/backend/db2";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export async function getUserComplaints() {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id) return [];

// }
"use server";

import { sql } from "@/app/backend/db2";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getUserComplaints() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) return [];

  const complaints = await sql`
    SELECT 
      c.complaint_id,
      c.user_id,
      c.category_id,
      c.title,
      c.description,
      c.priority_request,
      c.status_id,
      c.assigned_to,
      c.images,
      c.flat_id,
      c.created_at,
      c.updated_at,
      c.deleted_at,
      c.is_real_complaint,
      c.verification_status,
      -- Get flat details from flats table
      f.flat_number,
      f.floor_number
    FROM public.complaints c
    LEFT JOIN public.flats f ON c.flat_id = f.id
    WHERE c.user_id = ${session.user.id}
      AND c.deleted_at IS NULL
    ORDER BY c.created_at DESC
  `;

  return complaints;
}