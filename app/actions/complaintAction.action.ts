"use server";

import { headers } from "next/headers";
import {sql} from "@/app/backend/db2";
import { pool } from "../backend/db";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Get all complaints
export async function showcomplaints() {
  try {
    const complaints = await sql`
      SELECT * FROM complaints 
      WHERE deleted_at IS NULL 
      ORDER BY created_at DESC
    `;
    return complaints;
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return [];
  }
}

// Update complaint status (status is integer)
export async function updateComplaintStatus(formData: FormData) {
  try {
    const complaint_id = Number(formData.get("complaint_id"));
    const status = Number(formData.get("status")); // Convert to number
    
    await sql`
      UPDATE complaints 
      SET status_id = ${status}, updated_at = NOW()
      WHERE complaint_id = ${complaint_id}
    `;
    
    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

// Verify complaint (real or fake)
export async function verifyComplaint(formData: FormData) {
  try {
    const complaint_id = Number(formData.get("complaint_id"));
    const is_real = formData.get("is_real") === "true";
    
    await sql`
      UPDATE complaints 
      SET verification_status = ${is_real ? 1 : 0}, updated_at = NOW()
      WHERE complaint_id = ${complaint_id}
    `;
    
    return { success: true };
  } catch (error) {
    console.error("Error verifying complaint:", error);
    return { success: false, error: "Failed to verify complaint" };
  }
}


export async function assignComplaint(complaint_id: number) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const user_id = Number(session.user.id);

  await sql`
    UPDATE complaints
    SET assigned_to = ${user_id}
    WHERE complaint_id = ${complaint_id}
  `;

  console.log("📌 Complaint assigned to user:", user_id);

  const baseUrl =
    process.env.NEXTAUTH_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/push/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id,
      title: "Complaint Assigned 📌",
      body: "A complaint has been assigned to you.",
    }),
  });

  console.log("🔔 Push send status:", res.status);

  return { success: true };
}
